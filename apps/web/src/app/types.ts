import type { Grid, LineWin, SlotConfig, SlotState } from "@cat-fortune/core";

export type WebUiState = {
  balance: number;
  bet: number;
  lastWin: number;
  spinning: boolean;
  message: string;
};

export type ConfigOption = {
  readonly value: string;
  readonly label: string;
  readonly config: SlotConfig;
};

export type WebRenderModel = {
  readonly slotState: SlotState;
  readonly grid: Grid | null;
  readonly wins: readonly LineWin[];
  readonly ui: WebUiState;
  readonly selectedConfigValue: string;
  readonly configOptions: readonly ConfigOption[];
};
