import type { Grid, LineWin } from "@cat-fortune/core";
import type { ConfigOption, WebRenderModel } from "../app/types.js";
import { getSymbolView } from "./SymbolView.js";

type CellRef = {
  readonly element: HTMLDivElement;
  readonly reel: number;
  readonly row: number;
};

export class WebRenderer {
  private readonly root: HTMLElement;
  private readonly balanceValue: HTMLElement;
  private readonly betInput: HTMLInputElement;
  private readonly seedInput: HTMLInputElement;
  private readonly lastWinValue: HTMLElement;
  private readonly messageValue: HTMLElement;
  private readonly spinButton: HTMLButtonElement;
  private readonly applySeedButton: HTMLButtonElement;
  private readonly configSelect: HTMLSelectElement;
  private readonly cells: CellRef[];

  public constructor(root: HTMLElement) {
    this.root = root;
    this.root.innerHTML = this.renderLayout();

    this.balanceValue = this.getRequired("[data-role='balance']");
    this.betInput = this.getRequired("[data-role='bet']");
    this.seedInput = this.getRequired("[data-role='seed']");
    this.lastWinValue = this.getRequired("[data-role='last-win']");
    this.messageValue = this.getRequired("[data-role='message']");
    this.spinButton = this.getRequired("[data-role='spin']");
    this.applySeedButton = this.getRequired("[data-role='apply-seed']");
    this.configSelect = this.getRequired("[data-role='config']");
    this.cells = this.collectCells();
  }

  public getBetInput(): HTMLInputElement {
    return this.betInput;
  }

  public getSeedInput(): HTMLInputElement {
    return this.seedInput;
  }

  public getSpinButton(): HTMLButtonElement {
    return this.spinButton;
  }

  public getApplySeedButton(): HTMLButtonElement {
    return this.applySeedButton;
  }

  public getConfigSelect(): HTMLSelectElement {
    return this.configSelect;
  }

  public setConfigOptions(
    options: readonly ConfigOption[],
    selectedValue: string,
  ): void {
    this.configSelect.innerHTML = options
      .map((option) => {
        const selected = option.value === selectedValue ? " selected" : "";

        return `<option value="${option.value}"${selected}>${option.label}</option>`;
      })
      .join("");
  }

  public render(model: WebRenderModel): void {
    this.balanceValue.textContent = String(model.ui.balance);
    this.lastWinValue.textContent = String(model.ui.lastWin);
    this.messageValue.textContent = model.ui.message;
    this.betInput.value = String(model.ui.bet);
    this.configSelect.value = model.selectedConfigValue;

    this.spinButton.disabled = model.ui.spinning;
    this.betInput.disabled = model.ui.spinning;
    this.seedInput.disabled = model.ui.spinning;
    this.applySeedButton.disabled = model.ui.spinning;
    this.configSelect.disabled = model.ui.spinning;

    this.renderGrid(model.grid);
    this.renderWins(model.wins);
  }

  private renderGrid(grid: Grid | null): void {
    for (const cell of this.cells) {
      cell.element.classList.remove("win");

      if (grid === null) {
        cell.element.textContent = "❔";
        continue;
      }

      const symbol = grid[cell.reel]?.[cell.row];
      cell.element.textContent =
        symbol === undefined ? "❔" : getSymbolView(symbol);
    }
  }

  private renderWins(wins: readonly LineWin[]): void {
    for (const win of wins) {
      for (const position of win.positions) {
        const cell = this.cells.find(
          (item) => item.reel === position.col && item.row === position.row,
        );

        if (cell !== undefined) {
          cell.element.classList.add("win");
        }
      }
    }
  }

  private collectCells(): CellRef[] {
    const result: CellRef[] = [];

    for (let reel = 0; reel < 5; reel += 1) {
      for (let row = 0; row < 3; row += 1) {
        const element = this.getRequired<HTMLDivElement>(
          `[data-reel='${reel}'][data-row='${row}']`,
        );

        result.push({ element, reel, row });
      }
    }

    return result;
  }

  private getRequired<T extends Element>(selector: string): T {
    const node = this.root.querySelector(selector);

    if (node === null) {
      throw new Error(`Missing required element: ${selector}`);
    }

    return node as T;
  }

  private renderLayout(): string {
    return `
      <div class="slot-shell">
        <div class="slot-toolbar">
          <div class="slot-card">
            <label class="slot-label">Config</label>
            <select data-role="config"></select>
          </div>

          <div class="slot-card">
            <label class="slot-label">Seed</label>
            <div class="slot-inline">
              <input data-role="seed" type="number" min="0" value="12345" />
              <button data-role="apply-seed" type="button">Apply</button>
            </div>
          </div>

          <div class="slot-card">
            <label class="slot-label">Bet</label>
            <input data-role="bet" type="number" min="1" max="100" value="10" />
          </div>

          <div class="slot-card slot-stats">
            <div>Balance: <strong data-role="balance">0</strong></div>
            <div>Last win: <strong data-role="last-win">0</strong></div>
          </div>
        </div>

        <div class="slot-machine">
          <div class="slot-grid">
            ${this.renderReels()}
          </div>
        </div>

        <div class="slot-actions">
          <button data-role="spin" type="button" class="slot-spin-button">
            SPIN
          </button>
        </div>

        <div class="slot-message" data-role="message"></div>
      </div>
    `;
  }

  private renderReels(): string {
    let html = "";

    for (let reel = 0; reel < 5; reel += 1) {
      html += `<div class="slot-reel">`;

      for (let row = 0; row < 3; row += 1) {
        html += `
          <div class="slot-cell" data-reel="${reel}" data-row="${row}">
            ❔
          </div>
        `;
      }

      html += `</div>`;
    }

    return html;
  }
}
