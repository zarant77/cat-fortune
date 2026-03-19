import { config } from "@cat-fortune/config";
import {
  createInitialState,
  spinOnce,
  type Grid,
  type SlotState,
} from "@cat-fortune/core";
import {
  DEFAULT_BET,
  INITIAL_BALANCE,
  MAX_BET,
  MIN_BET,
  SPIN_ANIMATION_FRAME_MS,
  WIN_SOUND_INTERVAL,
} from "./constants.js";
import type { KeyAction } from "../input/KeyboardController.js";
import { KeyboardController } from "../input/KeyboardController.js";
import { render } from "../render/Renderer.js";
import type { RenderModel, UiState } from "./types.js";
import { createSpinFrames } from "../animation/SpinAnimator.js";
import { createWinFrames } from "../animation/WinAnimator.js";
import { createWinPresentationFrames } from "../animation/WinPresentationAnimator.js";
import { playReelStopBell, playWinBell } from "../audio/TerminalAudio.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class CliApp {
  private slotState: SlotState = createInitialState(12345);
  private grid: Grid | null = null;
  private readonly keyboard: KeyboardController;
  private ui: UiState = {
    balance: INITIAL_BALANCE,
    bet: DEFAULT_BET,
    lastWin: 0,
    spinning: false,
    message: "Press Enter or Space to spin",
    inputMode: "normal",
    seedDraft: "",
    betDraft: "",
    gridMode: "normal",
    winPresentation: null,
  };

  private quitting = false;
  private winPresentationActive = false;
  private skipWinPresentationRequested = false;

  public constructor() {
    this.keyboard = new KeyboardController((action) => {
      void this.handleAction(action);
    });
  }

  public run(): void {
    this.keyboard.start();
    this.render();
  }

  public shutdown(): void {
    if (this.quitting) {
      return;
    }

    this.quitting = true;
    this.keyboard.stop();

    if (process.stdout.isTTY === true) {
      process.stdout.write("\x1b[?25h");
      process.stdout.write("\x1b[2J");
      process.stdout.write("\x1b[H");
    }

    process.stdout.write("Bye, cat gambler.\n");
  }

  private render(): void {
    const model: RenderModel = {
      slotState: this.slotState,
      grid: this.grid,
      wins: this.slotState.lastSpin?.wins ?? [],
      ui: this.ui,
    };

    render(model);
  }

  private async handleAction(action: KeyAction): Promise<void> {
    if (this.quitting) {
      return;
    }

    if (action.type === "quit") {
      this.shutdown();
      return;
    }

    if (this.ui.inputMode === "editing-seed") {
      await this.handleSeedEditingAction(action);
      return;
    }

    if (this.ui.inputMode === "editing-bet") {
      await this.handleBetEditingAction(action);
      return;
    }

    if (this.winPresentationActive === true && action.type === "spin") {
      this.skipWinPresentationRequested = true;
      return;
    }

    if (this.ui.spinning) {
      return;
    }

    if (action.type === "edit-seed") {
      const currentSeed =
        Number.isInteger(this.slotState.seed) && this.slotState.seed >= 0
          ? this.slotState.seed
          : 0;

      this.ui.inputMode = "editing-seed";
      this.ui.seedDraft = String(currentSeed);
      this.ui.message = "Editing seed";
      this.render();
      return;
    }

    if (action.type === "edit-bet") {
      this.ui.inputMode = "editing-bet";
      this.ui.betDraft = String(this.ui.bet);
      this.ui.message = "Editing bet";
      this.render();
      return;
    }

    if (action.type === "spin") {
      await this.spin();
    }
  }

  private async handleSeedEditingAction(action: KeyAction): Promise<void> {
    if (action.type === "seed-digit") {
      this.ui.seedDraft += action.value;
      this.render();
      return;
    }

    if (action.type === "seed-backspace") {
      this.ui.seedDraft = this.ui.seedDraft.slice(0, -1);
      this.render();
      return;
    }

    if (action.type === "seed-cancel" || action.type === "edit-seed") {
      this.ui.inputMode = "normal";
      this.ui.seedDraft = "";
      this.ui.message = "Seed edit cancelled";
      this.render();
      return;
    }

    if (action.type === "spin") {
      const draft = this.ui.seedDraft.trim();

      if (draft.length === 0) {
        this.ui.message = "Seed cannot be empty";
        this.render();
        return;
      }

      const nextSeed = Number(draft);

      if (!Number.isInteger(nextSeed) || nextSeed < 0) {
        this.ui.message = "Invalid seed";
        this.render();
        return;
      }

      this.slotState = createInitialState(nextSeed);
      this.grid = null;
      this.ui.balance = INITIAL_BALANCE;
      this.ui.lastWin = 0;
      this.ui.inputMode = "normal";
      this.ui.seedDraft = "";
      this.ui.bet = DEFAULT_BET;
      this.ui.betDraft = "";
      this.ui.gridMode = "normal";
      this.ui.winPresentation = null;
      this.ui.message = `Seed updated to ${nextSeed}`;
      this.render();
    }
  }

  private async handleBetEditingAction(action: KeyAction): Promise<void> {
    if (action.type === "seed-digit") {
      this.ui.betDraft += action.value;
      this.render();
      return;
    }

    if (action.type === "seed-backspace") {
      this.ui.betDraft = this.ui.betDraft.slice(0, -1);
      this.render();
      return;
    }

    if (action.type === "seed-cancel" || action.type === "edit-bet") {
      this.ui.inputMode = "normal";
      this.ui.betDraft = "";
      this.ui.message = "Bet edit cancelled";
      this.render();
      return;
    }

    if (action.type === "spin") {
      const draft = this.ui.betDraft.trim();

      if (draft.length === 0) {
        this.ui.message = "Bet cannot be empty";
        this.render();
        return;
      }

      const nextBet = Number(draft);

      if (!Number.isInteger(nextBet)) {
        this.ui.message = "Invalid bet";
        this.render();
        return;
      }

      if (nextBet < MIN_BET || nextBet > MAX_BET) {
        this.ui.message = `Bet must be ${MIN_BET}-${MAX_BET}`;
        this.render();
        return;
      }

      this.ui.bet = nextBet;
      this.ui.betDraft = "";
      this.ui.inputMode = "normal";
      this.ui.message = `Bet updated to ${nextBet}`;
      this.render();
    }
  }

  private async spin(): Promise<void> {
    if (this.ui.balance < this.ui.bet) {
      this.ui.message = `Not enough balance for spin (${this.ui.bet})`;
      this.render();
      return;
    }

    this.skipWinPresentationRequested = false;
    this.winPresentationActive = false;

    this.ui.balance -= this.ui.bet;
    this.ui.lastWin = 0;
    this.ui.spinning = true;
    this.ui.gridMode = "normal";
    this.ui.winPresentation = null;
    this.ui.message = `Spinning... Cost: ${this.ui.bet}`;
    this.render();

    const nextState = spinOnce(config, this.slotState);
    const finalSpin = nextState.lastSpin;

    if (finalSpin === null) {
      throw new Error("Missing spin result");
    }

    const frames = createSpinFrames(finalSpin.grid);
    const stopStart = Math.max(0, frames.length - config.reels.length);

    for (let index = 0; index < frames.length; index += 1) {
      const frame = frames[index];

      if (frame === undefined) {
        continue;
      }

      this.grid = frame;
      this.render();

      if (index >= stopStart) {
        playReelStopBell();
      }

      await sleep(SPIN_ANIMATION_FRAME_MS);
    }

    this.slotState = nextState;
    this.grid = finalSpin.grid;

    const scaledWin = finalSpin.totalWin * this.ui.bet;
    this.ui.lastWin = scaledWin;
    this.ui.balance += scaledWin;
    this.ui.spinning = false;
    this.ui.message =
      scaledWin > 0 ? `Nice! You won ${scaledWin}` : "No win this time";

    this.render();

    const lineFrames = createWinFrames(finalSpin.wins.length > 0);

    for (const frame of lineFrames) {
      this.ui.gridMode = frame.mode;
      this.render();
      await sleep(frame.durationMs);
    }

    this.ui.gridMode = finalSpin.wins.length > 0 ? "win-symbols" : "normal";
    this.render();

    if (scaledWin <= 0) {
      return;
    }

    const presentationFrames = createWinPresentationFrames(scaledWin);

    this.winPresentationActive = true;
    this.skipWinPresentationRequested = false;

    for (let index = 0; index < presentationFrames.length; index += 1) {
      if (this.skipWinPresentationRequested) {
        break;
      }

      const frame = presentationFrames[index];

      if (frame === undefined) {
        continue;
      }

      this.ui.winPresentation = frame.model;
      this.render();

      if (index % WIN_SOUND_INTERVAL === 0) {
        playWinBell();
      }

      await sleep(frame.durationMs);
    }

    this.winPresentationActive = false;
    this.skipWinPresentationRequested = false;
    this.ui.winPresentation = null;
    this.render();
  }
}
