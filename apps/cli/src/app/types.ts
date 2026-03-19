import type { Grid, LineWin, SlotState } from "@cat-fortune/core";

export type InputMode = "normal" | "editing-seed" | "editing-bet";
export type GridRenderMode = "normal" | "win-symbols" | "win-line";

export type WinPresentationModel = {
  readonly lines: readonly string[];
};

export type UiState = {
  balance: number;
  bet: number;
  lastWin: number;
  spinning: boolean;
  message: string;
  inputMode: InputMode;
  seedDraft: string;
  betDraft: string;
  gridMode: GridRenderMode;
  winPresentation: WinPresentationModel | null;
};

export type RenderModel = {
  readonly slotState: SlotState;
  readonly grid: Grid | null;
  readonly wins: readonly LineWin[];
  readonly ui: UiState;
};
