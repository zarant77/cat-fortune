import type { Grid, SlotConfig, SymbolId } from "@cat-fortune/core";
import { SPIN_ANIMATION_FRAMES } from "../app/constants.js";

function getRandomSymbol(config: SlotConfig): SymbolId {
  const reelIndex = Math.floor(Math.random() * config.reels.length);
  const reel = config.reels[reelIndex];

  const stopIndex = Math.floor(Math.random() * reel.length);
  const symbol = reel[stopIndex];

  if (symbol === undefined) {
    throw new Error("Missing symbol in reel");
  }

  return symbol;
}

function createRandomFrame(config: SlotConfig, template: Grid): Grid {
  return template.map((column) =>
    column.map(() => getRandomSymbol(config)),
  ) as Grid;
}

export function createSpinFrames(config: SlotConfig, finalGrid: Grid): Grid[] {
  const frames: Grid[] = [];

  for (let index = 0; index < SPIN_ANIMATION_FRAMES; index += 1) {
    const baseFrame = createRandomFrame(config, finalGrid);

    const stopStart = Math.max(0, SPIN_ANIMATION_FRAMES - config.reels.length);
    const lockedColumns = Math.max(0, index - stopStart + 1);

    const frame = baseFrame.map((column, columnIndex) => {
      if (columnIndex < lockedColumns) {
        return finalGrid[columnIndex] ?? column;
      }

      return column;
    }) as Grid;

    frames.push(frame);
  }

  return frames;
}
