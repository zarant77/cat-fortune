export class ScreenBuffer {
  private readonly lines: string[] = [];

  public writeLine(line = ""): void {
    this.lines.push(line);
  }

  public writeLines(lines: readonly string[]): void {
    for (const line of lines) {
      this.lines.push(line);
    }
  }

  public toLines(): readonly string[] {
    return this.lines;
  }

  public toString(): string {
    return this.lines.join("\n");
  }
}
