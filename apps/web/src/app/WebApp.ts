import { allConfigs } from "@cat-fortune/config";
import {
  createInitialState,
  spinOnce,
  type Grid,
  type LineWin,
  type SlotConfig,
  type SlotState,
} from "@cat-fortune/core";
import {
  DEFAULT_BET,
  INITIAL_BALANCE,
  MAX_BET,
  MIN_BET,
  SPIN_ANIMATION_FRAME_MS,
} from "./constants.js";
import { createSpinFrames } from "../animation/SpinAnimator.js";
import { WebRenderer } from "../render/WebRenderer.js";
import type { ConfigOption, WebRenderModel, WebUiState } from "./types.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getConfigName(config: SlotConfig, index: number): string {
  const record = config as Record<string, unknown>;
  const name = record["name"];

  if (typeof name === "string" && name.trim().length > 0) {
    return name;
  }

  return `Config ${index + 1}`;
}

function createConfigOptions(): ConfigOption[] {
  return allConfigs.map((config, index) => {
    const label = getConfigName(config, index);
    const value = `config-${index}`;

    return {
      value,
      label,
      config,
    };
  });
}

export class WebApp {
  private readonly renderer: WebRenderer;
  private readonly configOptions: readonly ConfigOption[];

  private selectedConfigValue: string;
  private selectedConfig: SlotConfig;

  private slotState: SlotState = createInitialState(12345);
  private grid: Grid | null = null;
  private wins: readonly LineWin[] = [];

  private ui: WebUiState = {
    balance: INITIAL_BALANCE,
    bet: DEFAULT_BET,
    lastWin: 0,
    spinning: false,
    message: "Press Spin",
  };

  public constructor(root: HTMLElement) {
    this.renderer = new WebRenderer(root);

    this.configOptions = createConfigOptions();

    const firstOption = this.configOptions[0];

    if (firstOption === undefined) {
      throw new Error("No slot configs available");
    }

    this.selectedConfigValue = firstOption.value;
    this.selectedConfig = firstOption.config;

    this.renderer.setConfigOptions(
      this.configOptions,
      this.selectedConfigValue,
    );

    this.bindEvents();
    this.render();
  }

  private bindEvents(): void {
    this.renderer.getSpinButton().addEventListener("click", () => {
      void this.spin();
    });

    this.renderer.getApplySeedButton().addEventListener("click", () => {
      this.applySeed();
    });

    this.renderer.getConfigSelect().addEventListener("change", () => {
      this.applyConfig();
    });

    this.renderer.getSeedInput().addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.applySeed();
      }
    });

    this.renderer.getBetInput().addEventListener("change", () => {
      this.applyBet();
    });

    this.renderer.getBetInput().addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.applyBet();
      }
    });
  }

  private render(): void {
    const model: WebRenderModel = {
      slotState: this.slotState,
      grid: this.grid,
      wins: this.wins,
      ui: this.ui,
      selectedConfigValue: this.selectedConfigValue,
      configOptions: this.configOptions,
    };

    this.renderer.render(model);
  }

  private applyConfig(): void {
    if (this.ui.spinning) {
      return;
    }

    const nextValue = this.renderer.getConfigSelect().value;

    const nextOption = this.configOptions.find(
      (option) => option.value === nextValue,
    );

    if (nextOption === undefined) {
      this.ui.message = "Invalid config";
      this.render();
      return;
    }

    this.selectedConfigValue = nextOption.value;
    this.selectedConfig = nextOption.config;

    this.grid = null;
    this.wins = [];
    this.ui.balance = INITIAL_BALANCE;
    this.ui.lastWin = 0;
    this.ui.bet = DEFAULT_BET;
    this.ui.message = `Config changed to ${nextOption.label}`;

    this.render();
  }

  private applySeed(): void {
    if (this.ui.spinning) {
      return;
    }

    const rawValue = this.renderer.getSeedInput().value.trim();
    const nextSeed = Number(rawValue);

    if (rawValue.length === 0) {
      this.ui.message = "Seed cannot be empty";
      this.render();
      return;
    }

    if (!Number.isInteger(nextSeed) || nextSeed < 0) {
      this.ui.message = "Invalid seed";
      this.render();
      return;
    }

    this.slotState = createInitialState(nextSeed);
    this.grid = null;
    this.wins = [];
    this.ui.balance = INITIAL_BALANCE;
    this.ui.lastWin = 0;
    this.ui.bet = DEFAULT_BET;
    this.ui.message = `Seed updated to ${nextSeed}`;
    this.render();
  }

  private applyBet(): boolean {
    if (this.ui.spinning) {
      return false;
    }

    const rawValue = this.renderer.getBetInput().value.trim();
    const nextBet = Number(rawValue);

    if (rawValue.length === 0) {
      this.ui.message = "Bet cannot be empty";
      this.render();
      return false;
    }

    if (!Number.isInteger(nextBet)) {
      this.ui.message = "Invalid bet";
      this.render();
      return false;
    }

    if (nextBet < MIN_BET || nextBet > MAX_BET) {
      this.ui.message = `Bet must be ${MIN_BET}-${MAX_BET}`;
      this.render();
      return false;
    }

    this.ui.bet = nextBet;
    this.ui.message = `Bet updated to ${nextBet}`;
    this.render();

    return true;
  }

  private async spin(): Promise<void> {
    if (this.ui.spinning) {
      return;
    }

    if (!this.applyBet()) {
      return;
    }

    if (this.ui.balance < this.ui.bet) {
      this.ui.message = `Not enough balance for spin (${this.ui.bet})`;
      this.render();
      return;
    }

    this.ui.balance -= this.ui.bet;
    this.ui.lastWin = 0;
    this.ui.spinning = true;
    this.ui.message = `Spinning... Cost: ${this.ui.bet}`;
    this.wins = [];

    this.render();

    const nextState = spinOnce(this.selectedConfig, this.slotState);
    const finalSpin = nextState.lastSpin;

    if (finalSpin === null) {
      throw new Error("Missing spin result");
    }

    const frames = createSpinFrames(this.selectedConfig, finalSpin.grid);

    for (const frame of frames) {
      this.grid = frame;
      this.render();
      await sleep(SPIN_ANIMATION_FRAME_MS);
    }

    this.slotState = nextState;
    this.grid = finalSpin.grid;
    this.wins = finalSpin.wins;

    const scaledWin = finalSpin.totalWin * this.ui.bet;
    this.ui.lastWin = scaledWin;
    this.ui.balance += scaledWin;
    this.ui.spinning = false;
    this.ui.message =
      scaledWin > 0 ? `Nice! You won ${scaledWin}` : "No win this time";

    this.render();
  }
}
