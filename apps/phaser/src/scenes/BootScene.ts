import Phaser from "phaser";
import { config } from "@cat-fortune/config";
import {
  createInitialState,
  spinOnce,
  type Grid,
  type SymbolId,
} from "@cat-fortune/core";

const SYMBOL_LABELS: Readonly<Record<SymbolId, string>> = {
  LOW_1: "🐭",
  LOW_2: "🧶",
  LOW_3: "🥛",
  LOW_4: "🐾",
  MID_1: "🐟",
  MID_2: "🎣",
  HIGH_1: "😼",
  HIGH_2: "👑",
  WILD: "💥",
};

const INITIAL_BALANCE = 1000;
const SPIN_COST = 10;
const CELL_SIZE = 120;
const CELL_GAP = 18;
const REELS = 5;
const ROWS = 3;
const SPIN_FRAMES = 18;
const SPIN_FRAME_MS = 55;

type ReelCell = {
  readonly frame: Phaser.GameObjects.Rectangle;
  readonly label: Phaser.GameObjects.Text;
};

export class BootScene extends Phaser.Scene {
  private balance = INITIAL_BALANCE;
  private slotState = createInitialState(12345);
  private readonly cellMatrix: ReelCell[][] = [];
  private readonly winHighlights: Phaser.GameObjects.Rectangle[] = [];
  private balanceText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private spinButton!: Phaser.GameObjects.Container;
  private spinButtonBg!: Phaser.GameObjects.Rectangle;
  private spinButtonText!: Phaser.GameObjects.Text;
  private isSpinning = false;

  public constructor() {
    super("boot");
  }

  public create(): void {
    this.cameras.main.setBackgroundColor("#0f1117");

    this.add
      .text(640, 56, "Cat Fortune", {
        fontFamily: "Arial",
        fontSize: "42px",
        color: "#ffd54a",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.balanceText = this.add
      .text(640, 104, "", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#d7e6ff",
      })
      .setOrigin(0.5);

    this.createGrid();
    this.createButton();
    this.createStatus();
    this.drawIdleGrid();
    this.refreshHud();

    this.input.keyboard?.on("keydown-SPACE", () => {
      void this.spin();
    });

    this.input.keyboard?.on("keydown-ENTER", () => {
      void this.spin();
    });

    this.scale.on("resize", this.handleResize, this);
    this.handleResize();
  }

  private handleResize(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    this.cameras.resize(width, height);

    this.balanceText.setPosition(width * 0.5, 104);
    this.statusText.setPosition(width * 0.5, height - 58);
    this.spinButton.setPosition(width * 0.5, height - 120);

    const gridWidth = REELS * CELL_SIZE + (REELS - 1) * CELL_GAP;
    const gridHeight = ROWS * CELL_SIZE + (ROWS - 1) * CELL_GAP;
    const startX = (width - gridWidth) * 0.5 + CELL_SIZE * 0.5;
    const startY = (height - gridHeight) * 0.5 + 24 + CELL_SIZE * 0.5;

    for (let col = 0; col < this.cellMatrix.length; col += 1) {
      const column = this.cellMatrix[col];
      if (column === undefined) {
        continue;
      }

      for (let row = 0; row < column.length; row += 1) {
        const cell = column[row];
        if (cell === undefined) {
          continue;
        }

        const x = startX + col * (CELL_SIZE + CELL_GAP);
        const y = startY + row * (CELL_SIZE + CELL_GAP);
        cell.frame.setPosition(x, y);
        cell.label.setPosition(x, y);
      }
    }

    this.redrawHighlights();
  }

  private createGrid(): void {
    for (let col = 0; col < REELS; col += 1) {
      const column: ReelCell[] = [];

      for (let row = 0; row < ROWS; row += 1) {
        const frame = this.add.rectangle(
          0,
          0,
          CELL_SIZE,
          CELL_SIZE,
          0x1a2030,
          1,
        );
        frame.setStrokeStyle(2, 0x3f4b66);

        const label = this.add.text(0, 0, "·", {
          fontFamily: "Arial",
          fontSize: "56px",
          color: "#ffffff",
        });
        label.setOrigin(0.5);

        column.push({ frame, label });
      }

      this.cellMatrix.push(column);
    }
  }

  private createButton(): void {
    this.spinButtonBg = this.add.rectangle(0, 0, 220, 64, 0x2d8cff, 1);
    this.spinButtonBg.setStrokeStyle(2, 0xaed0ff);

    this.spinButtonText = this.add.text(0, 0, "SPIN", {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#ffffff",
      fontStyle: "bold",
    });
    this.spinButtonText.setOrigin(0.5);

    this.spinButton = this.add.container(0, 0, [
      this.spinButtonBg,
      this.spinButtonText,
    ]);
    this.spinButton.setSize(220, 64);
    this.spinButton.setInteractive(
      new Phaser.Geom.Rectangle(-110, -32, 220, 64),
      Phaser.Geom.Rectangle.Contains,
    );

    this.spinButton.on("pointerover", () => {
      if (!this.isSpinning && this.balance >= SPIN_COST) {
        this.spinButtonBg.setFillStyle(0x4ea2ff, 1);
      }
    });

    this.spinButton.on("pointerout", () => {
      this.refreshHud();
    });

    this.spinButton.on("pointerdown", () => {
      void this.spin();
    });
  }

  private createStatus(): void {
    this.statusText = this.add.text(
      640,
      660,
      "Press SPACE, ENTER or click SPIN",
      {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#9aa9c7",
        align: "center",
      },
    );
    this.statusText.setOrigin(0.5);
  }

  private drawIdleGrid(): void {
    const placeholder: Grid = [
      ["LOW_1", "MID_1", "HIGH_1"],
      ["LOW_2", "MID_2", "HIGH_2"],
      ["LOW_3", "WILD", "HIGH_1"],
      ["LOW_4", "MID_1", "HIGH_2"],
      ["LOW_1", "MID_2", "WILD"],
    ];

    this.applyGrid(placeholder);
  }

  private refreshHud(): void {
    this.balanceText.setText(
      `Balance: ${this.balance}   Seed: ${this.slotState.seed}   Spin: ${this.slotState.spinIndex}`,
    );

    const canSpin = this.balance >= SPIN_COST && !this.isSpinning;
    this.spinButtonBg.setFillStyle(canSpin ? 0x2d8cff : 0x4a5468, 1);
    this.spinButtonText.setAlpha(canSpin ? 1 : 0.65);
  }

  private applyGrid(grid: Grid): void {
    for (let col = 0; col < grid.length; col += 1) {
      const column = grid[col];
      const cellColumn = this.cellMatrix[col];

      if (column === undefined || cellColumn === undefined) {
        continue;
      }

      for (let row = 0; row < column.length; row += 1) {
        const symbol = column[row];
        const cell = cellColumn[row];

        if (symbol === undefined || cell === undefined) {
          continue;
        }

        cell.label.setText(SYMBOL_LABELS[symbol]);
        cell.frame.setFillStyle(symbol === "WILD" ? 0x442255 : 0x1a2030, 1);
      }
    }
  }

  private clearHighlights(): void {
    for (const rect of this.winHighlights) {
      rect.destroy();
    }

    this.winHighlights.length = 0;
  }

  private redrawHighlights(): void {
    if (this.slotState.lastSpin === null) {
      return;
    }

    this.showWinHighlights();
  }

  private showWinHighlights(): void {
    this.clearHighlights();

    const result = this.slotState.lastSpin;
    if (result === null) {
      return;
    }

    for (const win of result.wins) {
      for (const position of win.positions) {
        const cell = this.cellMatrix[position.col]?.[position.row];
        if (cell === undefined) {
          continue;
        }

        const highlight = this.add.rectangle(
          cell.frame.x,
          cell.frame.y,
          CELL_SIZE + 6,
          CELL_SIZE + 6,
        );
        highlight.setStrokeStyle(4, 0xffd54a);
        highlight.setFillStyle(0xffffff, 0);
        this.winHighlights.push(highlight);
      }
    }
  }

  private async spin(): Promise<void> {
    if (this.isSpinning) {
      return;
    }

    if (this.balance < SPIN_COST) {
      this.statusText.setText("Not enough balance");
      return;
    }

    this.isSpinning = true;
    this.clearHighlights();
    this.balance -= SPIN_COST;
    this.refreshHud();
    this.statusText.setText("Spinning...");

    const nextState = spinOnce(config, this.slotState);
    const finalSpin = nextState.lastSpin;

    if (finalSpin === null) {
      throw new Error("Missing spin result");
    }

    await this.animateSpin(finalSpin.grid);

    this.slotState = nextState;
    this.applyGrid(finalSpin.grid);
    this.balance += finalSpin.totalWin;
    this.refreshHud();

    if (finalSpin.totalWin > 0) {
      this.statusText.setText(`Win +${finalSpin.totalWin}`);
      this.showWinHighlights();
      await this.animateWinPulse();
    } else {
      this.statusText.setText("No win this time");
    }

    this.isSpinning = false;
    this.refreshHud();
  }

  private async animateSpin(finalGrid: Grid): Promise<void> {
    const symbols = Object.keys(SYMBOL_LABELS) as SymbolId[];

    for (let frameIndex = 0; frameIndex < SPIN_FRAMES; frameIndex += 1) {
      const columns: Grid = finalGrid.map((column, colIndex) => {
        return column.map((symbol, rowIndex) => {
          const lockThreshold = SPIN_FRAMES - (REELS - colIndex);
          const shouldLock = frameIndex >= lockThreshold;

          if (shouldLock) {
            return symbol;
          }

          const fallback =
            symbols[(frameIndex + colIndex * 2 + rowIndex) % symbols.length];
          return fallback ?? symbol;
        });
      });

      this.applyGrid(columns);
      await this.wait(SPIN_FRAME_MS);
    }
  }

  private async animateWinPulse(): Promise<void> {
    for (let i = 0; i < 6; i += 1) {
      for (const rect of this.winHighlights) {
        rect.setAlpha(i % 2 === 0 ? 1 : 0.25);
      }

      await this.wait(120);
    }

    for (const rect of this.winHighlights) {
      rect.setAlpha(1);
    }
  }

  private async wait(ms: number): Promise<void> {
    await new Promise<void>((resolve) => {
      this.time.delayedCall(ms, () => {
        resolve();
      });
    });
  }
}
