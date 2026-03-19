import type { SymbolId } from "@cat-fortune/core";

export const SYMBOL_VIEW: Readonly<Record<SymbolId, string>> = {
  LOW_1: "🐭", // mouse
  LOW_2: "🧶", // yarn
  LOW_3: "🥛", // milk
  LOW_4: "🐾", // paw

  MID_1: "🐟", // fish
  MID_2: "🐔", // chicken (prey tier upgrade 😏)

  HIGH_1: "😼", // smug cat
  HIGH_2: "🦁", // lion (boss energy)

  WILD: "💥", // wild
};

export const SYMBOL_IDS = Object.keys(SYMBOL_VIEW) as SymbolId[];
