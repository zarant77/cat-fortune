import stringWidth from "string-width";
import { UI } from "./theme.js";

export function color(text: string, ansi: string): string {
  return `${ansi}${text}${UI.text.reset}`;
}

export function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

export function visibleLength(text: string): number {
  return stringWidth(stripAnsi(text));
}

export function centerText(text: string, width: number): string {
  const length = visibleLength(text);

  if (length >= width) {
    return text;
  }

  const totalPadding = width - length;
  const left = Math.floor(totalPadding / 2);
  const right = totalPadding - left;

  return `${" ".repeat(left)}${text}${" ".repeat(right)}`;
}

export function padRightVisible(text: string, width: number): string {
  const length = visibleLength(text);

  if (length >= width) {
    return text;
  }

  return `${text}${" ".repeat(width - length)}`;
}
