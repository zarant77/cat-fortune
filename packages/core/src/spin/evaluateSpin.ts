import type {
  CellPosition,
  Grid,
  LineWin,
  SlotConfig,
  SymbolId,
} from "../types.js";

function getLineSymbols(
  grid: Grid,
  payline: readonly number[],
): readonly SymbolId[] {
  return payline.map((row, col) => {
    const column = grid[col];

    if (column === undefined) {
      throw new Error(`Missing column ${col}`);
    }

    const symbol = column[row];

    if (symbol === undefined) {
      throw new Error(`Missing symbol at col=${col}, row=${row}`);
    }

    return symbol;
  });
}

function getCandidateSymbols(
  lineSymbols: readonly SymbolId[],
  wildSymbol: SymbolId,
): readonly Exclude<SymbolId, "WILD">[] {
  const unique = new Set<Exclude<SymbolId, "WILD">>();

  for (const symbol of lineSymbols) {
    if (symbol !== wildSymbol) {
      unique.add(symbol as Exclude<SymbolId, "WILD">);
    }
  }

  return [...unique];
}

function getWinningPrefixLength(
  lineSymbols: readonly SymbolId[],
  targetSymbol: Exclude<SymbolId, "WILD">,
  wildSymbol: SymbolId,
): number {
  let count = 0;

  for (const symbol of lineSymbols) {
    if (symbol === targetSymbol || symbol === wildSymbol) {
      count += 1;
      continue;
    }

    break;
  }

  return count;
}

function countRealSymbolsInPrefix(
  lineSymbols: readonly SymbolId[],
  targetSymbol: Exclude<SymbolId, "WILD">,
  count: number,
): number {
  let realCount = 0;

  for (let index = 0; index < count; index += 1) {
    if (lineSymbols[index] === targetSymbol) {
      realCount += 1;
    }
  }

  return realCount;
}

function buildPositions(
  payline: readonly number[],
  count: number,
): readonly CellPosition[] {
  return payline.slice(0, count).map((row, col) => ({
    col,
    row,
  }));
}

export function evaluateSpin(
  config: SlotConfig,
  grid: Grid,
): readonly LineWin[] {
  const wins: LineWin[] = [];

  config.paylines.forEach((payline, paylineIndex) => {
    const lineSymbols = getLineSymbols(grid, payline);
    const candidates = getCandidateSymbols(lineSymbols, config.wildSymbol);

    let bestWin: LineWin | null = null;

    for (const candidate of candidates) {
      const count = getWinningPrefixLength(
        lineSymbols,
        candidate,
        config.wildSymbol,
      );

      if (count < 3) {
        continue;
      }

      const realCount = countRealSymbolsInPrefix(lineSymbols, candidate, count);

      // Important rule:
      // at least 2 real symbols are required,
      // wilds only extend the combination
      if (realCount < 2) {
        continue;
      }

      const payoutTable = config.paytable[candidate];
      const payout = payoutTable[count as 3 | 4 | 5];

      if (payout === undefined || payout <= 0) {
        continue;
      }

      const win: LineWin = {
        paylineIndex,
        symbol: candidate,
        count: count as 3 | 4 | 5,
        payout,
        positions: buildPositions(payline, count),
      };

      if (bestWin === null || win.payout > bestWin.payout) {
        bestWin = win;
      }
    }

    if (bestWin !== null) {
      wins.push(bestWin);
    }
  });

  return wins;
}
