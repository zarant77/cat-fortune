import type { RenderModel } from "../app/types.js";
import type { ScreenBuffer } from "./ScreenBuffer.js";
import { color } from "../ui/ansi.js";
import { UI } from "../ui/theme.js";

export function renderHelp(buffer: ScreenBuffer, model: RenderModel): void {
  if (model.ui.inputMode === "editing-seed") {
    buffer.writeLine(
      color(
        "Seed editor: digits to edit, Backspace to erase, Enter to apply, Esc to cancel",
        UI.text.muted,
      ),
    );
    return;
  }

  if (model.ui.inputMode === "editing-bet") {
    buffer.writeLine(
      color(
        "Bet editor: digits to edit, Backspace to erase, Enter to apply, Esc to cancel",
        UI.text.muted,
      ),
    );
    return;
  }

  buffer.writeLine(
    color(
      "Controls: [Enter/Space] Spin   [S] Edit seed   [B] Edit bet   [Q] Quit",
      UI.text.muted,
    ),
  );
}
