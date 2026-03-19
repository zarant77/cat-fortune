import type { GridRenderMode } from "../app/types.js";
import { WIN_FRAME_MS } from "../app/constants.js";

export type WinFrame = {
  readonly mode: GridRenderMode;
  readonly durationMs: number;
};

export function createWinFrames(hasWin: boolean): readonly WinFrame[] {
  if (!hasWin) {
    return [];
  }

  return [
    { mode: "win-symbols", durationMs: WIN_FRAME_MS },
    { mode: "win-line", durationMs: WIN_FRAME_MS },
    { mode: "win-symbols", durationMs: WIN_FRAME_MS },
    { mode: "win-line", durationMs: WIN_FRAME_MS },
    { mode: "win-symbols", durationMs: WIN_FRAME_MS + 40 },
  ];
}
