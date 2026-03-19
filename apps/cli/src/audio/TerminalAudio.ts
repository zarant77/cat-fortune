export function playBell(): void {
  if (process.stdout.isTTY !== true) {
    return;
  }

  process.stdout.write("\x07");
}

export function playReelStopBell(): void {
  playBell();
}

export function playWinBell(): void {
  playBell();
}
