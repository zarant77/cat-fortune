import { config } from "@cat-fortune/config";
import type { RenderModel } from "../app/types.js";
import { centerText, color, padRightVisible } from "../ui/ansi.js";
import { UI } from "../ui/theme.js";
import { renderGrid } from "./GridRenderer.js";
import { renderHeader } from "./HeaderRenderer.js";
import { renderHelp } from "./HelpRenderer.js";
import { renderLegend } from "./LegendRenderer.js";
import { ScreenBuffer } from "./ScreenBuffer.js";
import { renderStatus } from "./StatusRenderer.js";

const FRAME_CONTENT_HEIGHT = 20;

let isAlternateBufferActive = false;
let isCursorHidden = false;
let isCleanupRegistered = false;

function enterAlternateBuffer(): void {
  if (process.stdout.isTTY !== true || isAlternateBufferActive) {
    return;
  }

  process.stdout.write("\x1b[?1049h");
  isAlternateBufferActive = true;
}

function exitAlternateBuffer(): void {
  if (process.stdout.isTTY !== true || !isAlternateBufferActive) {
    return;
  }

  process.stdout.write("\x1b[?1049l");
  isAlternateBufferActive = false;
}

function hideCursor(): void {
  if (process.stdout.isTTY !== true || isCursorHidden) {
    return;
  }

  process.stdout.write("\x1b[?25l");
  isCursorHidden = true;
}

function showCursor(): void {
  if (process.stdout.isTTY !== true || !isCursorHidden) {
    return;
  }

  process.stdout.write("\x1b[?25h");
  isCursorHidden = false;
}

function cleanupAndExit(exitCode = 0): never {
  try {
    showCursor();
    exitAlternateBuffer();
  } finally {
    process.exit(exitCode);
  }
}

function registerCleanup(): void {
  if (isCleanupRegistered) {
    return;
  }

  process.once("SIGINT", () => cleanupAndExit(0));
  process.once("SIGTERM", () => cleanupAndExit(0));
  process.once("exit", () => {
    showCursor();
    exitAlternateBuffer();
  });

  isCleanupRegistered = true;
}

function ensureTerminalSession(): void {
  if (process.stdout.isTTY !== true) {
    return;
  }

  registerCleanup();
  enterAlternateBuffer();
  hideCursor();
}

function clearScreen(): void {
  if (process.stdout.isTTY !== true) {
    return;
  }

  process.stdout.write("\x1b[H");
  process.stdout.write("\x1b[2J");
}

function getTerminalWidth(): number {
  return process.stdout.columns ?? 100;
}

function frameLine(content: string): string {
  return `${color("│", UI.text.frame)}${content}${color("│", UI.text.frame)}`;
}

function emptyFrameLine(innerWidth: number): string {
  return frameLine(" ".repeat(innerWidth));
}

function buildNormalContent(
  model: RenderModel,
  contentWidth: number,
): readonly string[] {
  const content = new ScreenBuffer();

  renderHeader(content, model);
  content.writeLine("");

  if (model.grid !== null) {
    const grid = renderGrid(
      model.grid,
      model.wins,
      config.paylines,
      model.ui.gridMode,
    );

    for (const line of grid.split("\n")) {
      content.writeLine(centerText(line, contentWidth));
    }
  } else {
    content.writeLine(centerText("·   ·   ·   ·   ·", contentWidth));
    content.writeLine(centerText("·   ·   ·   ·   ·", contentWidth));
    content.writeLine(centerText("·   ·   ·   ·   ·", contentWidth));
  }

  content.writeLine("");
  renderStatus(content, model);
  content.writeLine("");
  renderLegend(content);
  renderHelp(content, model);

  return content.toLines();
}

function buildPresentationContent(
  model: RenderModel,
  contentWidth: number,
): readonly string[] {
  const lines = [...(model.ui.winPresentation?.lines ?? [])];

  const normalized = lines.map((line) => centerText(line, contentWidth));
  const topPadding = Math.max(
    0,
    Math.floor((FRAME_CONTENT_HEIGHT - normalized.length) / 2),
  );
  const bottomPadding = Math.max(
    0,
    FRAME_CONTENT_HEIGHT - normalized.length - topPadding,
  );

  return [
    ...Array.from({ length: topPadding }, () => ""),
    ...normalized,
    ...Array.from({ length: bottomPadding }, () => ""),
  ];
}

function normalizeLines(lines: readonly string[]): readonly string[] {
  const normalized = [...lines];

  if (normalized.length > FRAME_CONTENT_HEIGHT) {
    return normalized.slice(0, FRAME_CONTENT_HEIGHT);
  }

  while (normalized.length < FRAME_CONTENT_HEIGHT) {
    normalized.push("");
  }

  return normalized;
}

export function render(model: RenderModel): void {
  ensureTerminalSession();

  const innerWidth = UI.frame.width - 2;
  const contentWidth = innerWidth - UI.frame.paddingX * 2;

  const rawLines =
    model.ui.winPresentation !== null
      ? buildPresentationContent(model, contentWidth)
      : normalizeLines(buildNormalContent(model, contentWidth));

  const framed: string[] = [];
  framed.push(color(`┌${"─".repeat(innerWidth)}┐`, UI.text.frame));

  for (let i = 0; i < UI.frame.paddingY; i += 1) {
    framed.push(emptyFrameLine(innerWidth));
  }

  for (const rawLine of rawLines) {
    const padded = padRightVisible(rawLine, contentWidth);
    const finalLine = `${" ".repeat(UI.frame.paddingX)}${padded}${" ".repeat(UI.frame.paddingX)}`;

    framed.push(frameLine(finalLine));
  }

  for (let i = 0; i < UI.frame.paddingY; i += 1) {
    framed.push(emptyFrameLine(innerWidth));
  }

  framed.push(color(`└${"─".repeat(innerWidth)}┘`, UI.text.frame));

  const terminalWidth = getTerminalWidth();
  const centeredFrame = framed.map((line) => centerText(line, terminalWidth));

  clearScreen();
  process.stdout.write(centeredFrame.join("\n"));
}
