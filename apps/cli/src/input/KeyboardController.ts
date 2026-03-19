import readline from "node:readline";
import { stdin } from "node:process";

export type KeyAction =
  | { type: "spin" }
  | { type: "edit-bet" }
  | { type: "edit-seed" }
  | { type: "seed-digit"; value: string }
  | { type: "seed-backspace" }
  | { type: "seed-apply" }
  | { type: "seed-cancel" }
  | { type: "quit" };

export class KeyboardController {
  private readonly onAction: (action: KeyAction) => void;
  private active = false;
  private readonly boundHandler: (str: string, key: readline.Key) => void;

  public constructor(onAction: (action: KeyAction) => void) {
    this.onAction = onAction;
    this.boundHandler = this.handleKeypress.bind(this);
  }

  public start(): void {
    if (this.active) {
      return;
    }

    readline.emitKeypressEvents(stdin);
    if (stdin.isTTY === true) {
      stdin.setRawMode(true);
    }

    stdin.on("keypress", this.boundHandler);
    this.active = true;
  }

  public stop(): void {
    if (!this.active) {
      return;
    }

    stdin.off("keypress", this.boundHandler);
    if (stdin.isTTY === true) {
      stdin.setRawMode(false);
    }
    this.active = false;
  }

  private handleKeypress(_str: string, key: readline.Key): void {
    if (key.ctrl === true && key.name === "c") {
      this.onAction({ type: "quit" });
      return;
    }

    if (key.name === "return" || key.name === "enter" || key.name === "space") {
      this.onAction({ type: "spin" });
      return;
    }

    if (key.name === "backspace") {
      this.onAction({ type: "seed-backspace" });
      return;
    }

    if (key.name === "escape") {
      this.onAction({ type: "seed-cancel" });
      return;
    }

    if (key.name === "b") {
      this.onAction({ type: "edit-bet" });
    }

    if (key.name === "s") {
      this.onAction({ type: "edit-seed" });
      return;
    }

    if (key.name === "q") {
      this.onAction({ type: "quit" });
      return;
    }

    if (key.name !== undefined && /^[0-9]$/.test(key.name)) {
      this.onAction({ type: "seed-digit", value: key.name });
    }
  }
}
