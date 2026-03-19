import type { RenderModel } from "../app/types.js";
import type { ScreenBuffer } from "./ScreenBuffer.js";
import { color } from "../ui/ansi.js";
import { UI } from "../ui/theme.js";

export function renderStatus(buffer: ScreenBuffer, model: RenderModel): void {
  const lines: string[] = [];

  if (model.ui.winPresentation !== null) {
    while (lines.length < UI.status.reservedLines) {
      lines.push("");
    }

    buffer.writeLines(lines);
    return;
  }

  const messageColor = model.ui.lastWin > 0 ? UI.text.success : UI.text.muted;

  lines.push(color(model.ui.message, messageColor));
  lines.push("");

  lines.push(color("Wins:", UI.text.accent));

  if (model.wins.length > 0) {
    for (const win of model.wins) {
      lines.push(
        color(
          `- Line ${win.paylineIndex + 1}: ${win.symbol} x${win.count} => ${win.payout * model.ui.bet}`,
          UI.text.success,
        ),
      );
    }
  } else {
    lines.push(color("- none", UI.text.muted));
  }

  while (lines.length < UI.status.reservedLines) {
    lines.push("");
  }

  buffer.writeLines(lines.slice(0, UI.status.reservedLines));
}
