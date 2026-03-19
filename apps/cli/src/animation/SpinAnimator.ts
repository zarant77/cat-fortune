import type { Grid } from "@cat-fortune/core";
import { SPIN_ANIMATION_FRAMES } from "../app/constants.js";
import { SYMBOL_IDS } from "../ui/symbols.js";

export function createSpinFrames(finalGrid: Grid): readonly Grid[] {
  const frames: Grid[] = [];

  for (
    let frameIndex = 0;
    frameIndex < SPIN_ANIMATION_FRAMES;
    frameIndex += 1
  ) {
    const columns = finalGrid.map((column, colIndex) => {
      return column.map((_symbol, rowIndex) => {
        const finalPhase = frameIndex >= SPIN_ANIMATION_FRAMES - 3;

        if (finalPhase) {
          return column[rowIndex];
        }

        const value =
          SYMBOL_IDS[
            (frameIndex + colIndex * 2 + rowIndex) % SYMBOL_IDS.length
          ];
        if (value === undefined) {
          throw new Error("Missing animation symbol");
        }

        return value;
      });
    });

    frames.push(columns);
  }

  return frames;
}
