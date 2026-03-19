import {
  BIG_WIN_THRESHOLD,
  WIN_PRESENTATION_FRAME_MS,
} from "../app/constants.js";
import type { WinPresentationModel } from "../app/types.js";
import { renderWinPresentation } from "../render/WinPresentationRenderer.js";

export type WinPresentationFrame = {
  readonly model: WinPresentationModel;
  readonly durationMs: number;
};

function getFrameCount(totalWin: number, bigWin: boolean): number {
  if (bigWin) {
    if (totalWin >= BIG_WIN_THRESHOLD * 5) {
      return 26;
    }

    return 22;
  }

  return 16;
}

function getFrameDurationMs(
  frameIndex: number,
  frameCount: number,
  bigWin: boolean,
): number {
  const introFrames = bigWin ? 5 : 4;
  const settleFrames = 4;

  if (frameIndex < introFrames) {
    return Math.max(90, WIN_PRESENTATION_FRAME_MS - 35);
  }

  if (frameIndex >= frameCount - settleFrames) {
    return WIN_PRESENTATION_FRAME_MS + 70;
  }

  if (bigWin && frameIndex % 3 === 0) {
    return WIN_PRESENTATION_FRAME_MS + 20;
  }

  return WIN_PRESENTATION_FRAME_MS;
}

export function createWinPresentationFrames(
  totalWin: number,
): readonly WinPresentationFrame[] {
  if (totalWin <= 0) {
    return [];
  }

  const bigWin = totalWin >= BIG_WIN_THRESHOLD;
  const frameCount = getFrameCount(totalWin, bigWin);
  const frames: WinPresentationFrame[] = [];

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    frames.push({
      model: {
        lines: renderWinPresentation(totalWin, frameIndex, bigWin),
      },
      durationMs: getFrameDurationMs(frameIndex, frameCount, bigWin),
    });
  }

  return frames;
}
