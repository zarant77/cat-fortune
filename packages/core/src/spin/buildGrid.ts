import type { Grid, ReelStrip, SymbolId } from "../types.js";

function getWrappedSymbol(strip: ReelStrip, index: number): SymbolId {
  const wrappedIndex = ((index % strip.length) + strip.length) % strip.length;
  const symbol = strip[wrappedIndex];

  if (symbol === undefined) {
    throw new Error(`Missing symbol at index ${wrappedIndex}`);
  }

  return symbol;
}

export function buildGrid(
  reels: readonly ReelStrip[],
  rows: number,
  stops: readonly number[],
): Grid {
  if (reels.length !== stops.length) {
    throw new Error("Reels and stops length mismatch");
  }

  const columns: SymbolId[][] = reels.map((strip, col) => {
    const start = stops[col];

    if (start === undefined) {
      throw new Error(`Missing stop for reel ${col}`);
    }

    const visible: SymbolId[] = [];

    for (let row = 0; row < rows; row += 1) {
      visible.push(getWrappedSymbol(strip, start + row));
    }

    return visible;
  });

  return columns;
}
