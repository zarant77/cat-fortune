export const UI = {
  frame: {
    width: 76,
    paddingX: 2,
    paddingY: 1,
    contentHeight: 20,
  },
  status: {
    reservedLines: 9,
  },
  text: {
    title: "\x1b[38;5;220m",
    label: "\x1b[38;5;117m",
    value: "\x1b[38;5;255m",
    muted: "\x1b[38;5;244m",
    success: "\x1b[38;5;82m",
    danger: "\x1b[38;5;203m",
    accent: "\x1b[38;5;214m",
    frame: "\x1b[38;5;111m",
    wild: "\x1b[38;5;207m",
    reset: "\x1b[0m",
  },
} as const;
