import type { Grid, LineWin, SymbolId } from "@cat-fortune/core";
import type { GridRenderMode } from "../app/types.js";
import { color } from "../ui/ansi.js";
import { SYMBOL_VIEW } from "../ui/symbols.js";
import { UI } from "../ui/theme.js";

function cellKey(col: number, row: number): string {
  return `${col}:${row}`;
}

function getLineMarker(payline: readonly number[], col: number): string {
  const current = payline[col];
  const prev = payline[col - 1];
  const next = payline[col + 1];

  if (current === undefined) {
    return " *";
  }

  if (prev !== undefined && next !== undefined) {
    if (prev > current && next > current) {
      return " ^";
    }

    if (prev < current && next < current) {
      return " v";
    }
  }

  if (next !== undefined) {
    if (next < current) {
      return " /";
    }

    if (next > current) {
      return " \\";
    }
  }

  if (prev !== undefined) {
    if (prev < current) {
      return " /";
    }

    if (prev > current) {
      return " \\";
    }
  }

  return "--";
}

function formatSymbol(symbol: SymbolId): string {
  const symbolText = ` ${SYMBOL_VIEW[symbol]} `;

  if (symbol === "WILD") {
    return color(symbolText, UI.text.wild);
  }

  return color(symbolText, UI.text.value);
}

export function renderGrid(
  grid: Grid,
  wins: readonly LineWin[],
  paylines: readonly (readonly number[])[],
  mode: GridRenderMode,
): string {
  const rows = grid[0]?.length ?? 0;
  const winCells = new Map<string, { marker: string }>();

  for (const win of wins) {
    const payline = paylines[win.paylineIndex];

    if (payline === undefined) {
      continue;
    }

    for (const pos of win.positions) {
      winCells.set(cellKey(pos.col, pos.row), {
        marker: getLineMarker(payline, pos.col),
      });
    }
  }

  const lines: string[] = [];

  for (let row = 0; row < rows; row += 1) {
    const cells: string[] = [];

    for (let col = 0; col < grid.length; col += 1) {
      const symbol = grid[col]?.[row];

      if (symbol === undefined) {
        throw new Error(`Missing symbol at col=${col}, row=${row}`);
      }

      const key = cellKey(col, row);
      const winCell = winCells.get(key);

      if (winCell === undefined || mode === "normal") {
        cells.push(formatSymbol(symbol));
        continue;
      }

      if (mode === "win-symbols") {
        cells.push(color(`[${SYMBOL_VIEW[symbol]}]`, UI.text.success));
        continue;
      }

      cells.push(color(`[${winCell.marker}]`, UI.text.accent));
    }

    lines.push(cells.join(" "));
  }

  return lines.join("\n");
}
