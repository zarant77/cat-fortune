import type { SymbolId } from "@cat-fortune/core";

export const SYMBOL_VIEW: Readonly<Record<SymbolId, string>> = {
  LOW_1: "🐭",
  LOW_2: "🧶",
  LOW_3: "🥛",
  LOW_4: "🐾",
  MID_1: "🐟",
  MID_2: "🐔",
  HIGH_1: "😼",
  HIGH_2: "🦁",
  WILD: "💥",
};

export function getSymbolView(symbol: SymbolId): string {
  return SYMBOL_VIEW[symbol] ?? "❓";
}
