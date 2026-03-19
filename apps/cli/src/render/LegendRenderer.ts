import type { ScreenBuffer } from "./ScreenBuffer.js";
import { color } from "../ui/ansi.js";
import { UI } from "../ui/theme.js";
import { SYMBOL_VIEW } from "../ui/symbols.js";

export function renderLegend(buffer: ScreenBuffer): void {
  buffer.writeLine(
    color(
      [
        `${SYMBOL_VIEW.LOW_1} Low`,
        `${SYMBOL_VIEW.LOW_2} Low`,
        `${SYMBOL_VIEW.LOW_3} Low`,
        `${SYMBOL_VIEW.LOW_4} Low`,
      ].join("   "),
      UI.text.value,
    ),
  );

  buffer.writeLine(
    [
      color(`${SYMBOL_VIEW.MID_1} Mid`, UI.text.value),
      color(`${SYMBOL_VIEW.MID_2} Mid`, UI.text.value),
      color(`${SYMBOL_VIEW.HIGH_1} High`, UI.text.value),
      color(`${SYMBOL_VIEW.HIGH_2} High`, UI.text.value),
      color(`${SYMBOL_VIEW.WILD} Wild`, UI.text.wild),
    ].join("   "),
  );
}
