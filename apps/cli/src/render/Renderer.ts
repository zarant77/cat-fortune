import type { RenderModel } from "../app/types.js";
import { renderCompact } from "./CompactRenderer.js";
import { renderFull } from "./FullRenderer.js";
import {
  ensureTerminalSession,
  getTerminalSize,
  shutdownTerminalSession,
} from "./TerminalSession.js";

type LayoutMode = "full" | "compact";

function getLayoutMode(): LayoutMode {
  const { cols, rows } = getTerminalSize();

  if (cols < 90 || rows < 26) {
    return "compact";
  }

  return "full";
}

export function render(model: RenderModel): void {
  ensureTerminalSession();

  const mode = getLayoutMode();

  if (mode === "compact") {
    renderCompact(model);
  } else {
    renderFull(model);
  }
}

export function shutdownRenderer(): void {
  shutdownTerminalSession();
}
