export type SymbolId =
  | "LOW_1"
  | "LOW_2"
  | "LOW_3"
  | "LOW_4"
  | "MID_1"
  | "MID_2"
  | "HIGH_1"
  | "HIGH_2"
  | "WILD";

export type ReelStrip = readonly SymbolId[];
export type Payline = readonly number[];

export type SlotConfig = {
  readonly name: string;
  readonly rows: number;
  readonly reels: readonly ReelStrip[];
  readonly paylines: readonly Payline[];
  readonly paytable: Readonly<
    Record<Exclude<SymbolId, "WILD">, Readonly<Record<3 | 4 | 5, number>>>
  >;
  readonly wildSymbol: "WILD";
};

export type Grid = readonly (readonly SymbolId[])[];

export type CellPosition = {
  readonly col: number;
  readonly row: number;
};

export type LineWin = {
  readonly paylineIndex: number;
  readonly symbol: Exclude<SymbolId, "WILD">;
  readonly count: number;
  readonly payout: number;
  readonly positions: readonly CellPosition[];
};

export type SpinResult = {
  readonly stops: readonly number[];
  readonly grid: Grid;
  readonly wins: readonly LineWin[];
  readonly totalWin: number;
};

export type SlotState = {
  readonly seed: number;
  readonly spinIndex: number;
  readonly lastSpin: SpinResult | null;
};
