let isAlternateBufferActive = false;
let isCursorHidden = false;
let isCleanupRegistered = false;

function enterAlternateBuffer(): void {
  if (!process.stdout.isTTY || isAlternateBufferActive) return;

  process.stdout.write("\x1b[?1049h");
  isAlternateBufferActive = true;
}

function exitAlternateBuffer(): void {
  if (!process.stdout.isTTY || !isAlternateBufferActive) return;

  process.stdout.write("\x1b[?1049l");
  isAlternateBufferActive = false;
}

function hideCursor(): void {
  if (!process.stdout.isTTY || isCursorHidden) return;

  process.stdout.write("\x1b[?25l");
  isCursorHidden = true;
}

function showCursor(): void {
  if (!process.stdout.isTTY || !isCursorHidden) return;

  process.stdout.write("\x1b[?25h");
  isCursorHidden = false;
}

function cleanup(): void {
  showCursor();
  exitAlternateBuffer();
}

function cleanupAndExit(): never {
  cleanup();
  process.exit(0);
}

function registerCleanup(): void {
  if (isCleanupRegistered) return;

  process.once("SIGINT", cleanupAndExit);
  process.once("SIGTERM", cleanupAndExit);
  process.once("exit", cleanup);

  isCleanupRegistered = true;
}

export function ensureTerminalSession(): void {
  if (!process.stdout.isTTY) return;

  registerCleanup();
  enterAlternateBuffer();
  hideCursor();
}

export function shutdownTerminalSession(): void {
  cleanup();
}

export function clearScreen(): void {
  if (!process.stdout.isTTY) return;

  process.stdout.write("\x1b[H");
  process.stdout.write("\x1b[2J");
}

export function getTerminalSize(): { cols: number; rows: number } {
  return {
    cols: process.stdout.columns ?? 100,
    rows: process.stdout.rows ?? 30,
  };
}
