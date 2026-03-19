import { config } from "@cat-fortune/config";
import type { RenderModel } from "../app/types.js";
import { color } from "../ui/ansi.js";
import { UI } from "../ui/theme.js";
import { renderGrid } from "./GridRenderer.js";
import { renderHelp } from "./HelpRenderer.js";
import { renderLegend } from "./LegendRenderer.js";
import { ScreenBuffer } from "./ScreenBuffer.js";
import { clearScreen } from "./TerminalSession.js";

function normalizeDraft(value: string): string {
  if (!value || value === "undefined" || value === "null") {
    return "0";
  }
  return value;
}

function renderHeaderCompact(buffer: ScreenBuffer, model: RenderModel): void {
  buffer.writeLine(color("🐱 Cat Fortune", UI.text.title));

  const seed =
    model.ui.inputMode === "editing-seed"
      ? `[${normalizeDraft(model.ui.seedDraft)}_]`
      : `${model.slotState.seed}`;

  const bet =
    model.ui.inputMode === "editing-bet"
      ? `[${normalizeDraft(model.ui.betDraft)}_]`
      : `${model.ui.bet}`;

  buffer.writeLine(
    [
      `${color("Balance:", UI.text.label)} ${color(String(model.ui.balance), UI.text.value)}`,
      `${color("Bet:", UI.text.label)} ${color(bet, UI.text.accent)}`,
      `${color("Last win:", UI.text.label)} ${color(String(model.ui.lastWin), UI.text.value)}`,
      `${color("Spin:", UI.text.label)} ${color(String(model.slotState.spinIndex), UI.text.value)}`,
      `${color("Seed:", UI.text.label)} ${color(seed, UI.text.accent)}`,
    ].join("   "),
  );
}

function renderPresentation(buffer: ScreenBuffer, model: RenderModel): void {
  if (!model.ui.winPresentation) return;

  buffer.writeLine("");

  const msgColor = model.ui.lastWin > 0 ? UI.text.success : UI.text.muted;

  if (model.ui.message.trim()) {
    buffer.writeLine(color(model.ui.message, msgColor));
  }

  buffer.writeLine(color("Wins:", UI.text.accent));

  if (model.wins.length === 0) {
    buffer.writeLine(color("- none", UI.text.muted));
    return;
  }

  for (const win of model.wins) {
    buffer.writeLine(
      color(
        `- Line ${win.paylineIndex + 1}: ${win.symbol} x${win.count} => ${win.payout * model.ui.bet}`,
        UI.text.success,
      ),
    );
  }
}

export function renderCompact(model: RenderModel): void {
  const buffer = new ScreenBuffer();

  renderHeaderCompact(buffer, model);
  buffer.writeLine("");

  if (model.grid) {
    const grid = renderGrid(
      model.grid,
      model.wins,
      config.paylines,
      model.ui.gridMode,
    );

    for (const line of grid.split("\n")) {
      buffer.writeLine(line);
    }
  }

  buffer.writeLine("");
  renderLegend(buffer);
  buffer.writeLine("");
  renderHelp(buffer, model);

  renderPresentation(buffer, model);

  clearScreen();
  process.stdout.write(buffer.toLines().join("\n"));
}
