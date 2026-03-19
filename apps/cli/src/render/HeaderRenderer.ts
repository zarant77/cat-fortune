import type { RenderModel } from "../app/types.js";
import type { ScreenBuffer } from "./ScreenBuffer.js";
import { color } from "../ui/ansi.js";
import { UI } from "../ui/theme.js";

function normalizeDraft(value: string): string {
  if (value === "undefined" || value === "null" || value.trim() === "") {
    return "0";
  }

  return value;
}

export function renderHeader(buffer: ScreenBuffer, model: RenderModel): void {
  const seedValue =
    model.ui.inputMode === "editing-seed"
      ? `[${normalizeDraft(model.ui.seedDraft)}_]`
      : `${model.slotState.seed}`;

  const betValue =
    model.ui.inputMode === "editing-bet"
      ? `[${normalizeDraft(model.ui.betDraft)}_]`
      : `${model.ui.bet}`;

  buffer.writeLine(color("🐱 Cat Fortune", UI.text.title));
  buffer.writeLine(
    [
      `${color("Balance:", UI.text.label)} ${color(String(model.ui.balance), UI.text.value)}`,
      `${color("Bet:", UI.text.label)} ${color(betValue, UI.text.accent)}`,
      `${color("Last win:", UI.text.label)} ${color(String(model.ui.lastWin), UI.text.value)}`,
      `${color("Spin:", UI.text.label)} ${color(String(model.slotState.spinIndex), UI.text.value)}`,
      `${color("Seed:", UI.text.label)} ${color(seedValue, UI.text.accent)}`,
    ].join("   "),
  );
}
