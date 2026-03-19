import { centerText, color, padRightVisible } from "../ui/ansi.js";
import { UI } from "../ui/theme.js";

const PANEL_WIDTH = 34;

function frameTop(width: number, frameIndex: number, bigWin: boolean): string {
  const fill = frameIndex % 2 === 0 ? "=" : "-";
  const left = bigWin ? "#" : "+";
  const right = bigWin ? "#" : "+";
  return color(`${left}${fill.repeat(width)}${right}`, UI.text.success);
}

function frameBottom(
  width: number,
  frameIndex: number,
  bigWin: boolean,
): string {
  const fill = frameIndex % 2 === 0 ? "=" : "-";
  const left = bigWin ? "#" : "+";
  const right = bigWin ? "#" : "+";
  return color(`${left}${fill.repeat(width)}${right}`, UI.text.success);
}

function panelLine(content: string, ansi: string, width: number): string {
  const padded = padRightVisible(content, width);
  return `${color("|", UI.text.success)}${color(padded, ansi)}${color("|", UI.text.success)}`;
}

function emptyPanelLine(width: number): string {
  return `${color("|", UI.text.success)}${" ".repeat(width)}${color("|", UI.text.success)}`;
}

function getPulseColor(frameIndex: number): string {
  if (frameIndex % 3 === 0) {
    return UI.text.success;
  }

  if (frameIndex % 2 === 0) {
    return UI.text.accent;
  }

  return UI.text.value;
}

function getAuraLines(frameIndex: number, bigWin: boolean): readonly string[] {
  const compact = [
    "        *     +     *        ",
    "      +     * *     +        ",
    "        +     *     +        ",
    "      *     + +     *        ",
  ];

  const large = [
    "      *   +   *   +   *      ",
    "    +   *   + * +   *   +    ",
    "      +   *   +   *   +      ",
    "    *   +   * + *   +   *    ",
  ];

  const source = bigWin ? large : compact;
  const lineA = source[frameIndex % source.length] ?? "";
  const lineB = source[(frameIndex + 1) % source.length] ?? "";

  return [color(lineA, UI.text.accent), color(lineB, UI.text.accent)];
}

function getCatFrames(bigWin: boolean): readonly (readonly string[])[] {
  if (bigWin) {
    return [
      [
        "        /\\_/\\\\        ",
        "      =( ^.^ )=       ",
        '        (")(")        ',
      ],
      [
        "        /\\_/\\\\        ",
        "      =( ^o^ )=       ",
        '        (")(")        ',
      ],
      [
        "        /\\_/\\\\        ",
        "      =( >.< )=       ",
        '        (")(")        ',
      ],
    ];
  }

  return [
    [
      "         /\\_/\\\\       ",
      "       =( ^.^ )=      ",
      '         (")(")       ',
    ],
    [
      "         /\\_/\\\\       ",
      "       =( ^o^ )=      ",
      '         (")(")       ',
    ],
  ];
}

function getAnimatedCat(
  frameIndex: number,
  bigWin: boolean,
): readonly string[] {
  const frames = getCatFrames(bigWin);
  const current = frames[frameIndex % frames.length] ?? frames[0] ?? [];

  return current.map((line) => color(line, UI.text.accent));
}

function getCountUpValue(totalWin: number, frameIndex: number): number {
  const steps = [
    0.08, 0.16, 0.24, 0.34, 0.46, 0.58, 0.7, 0.8, 0.88, 0.94, 0.98, 1,
  ];

  const progress = steps[Math.min(frameIndex, steps.length - 1)] ?? 1;
  return Math.max(1, Math.floor(totalWin * progress));
}

function getTitle(frameIndex: number, bigWin: boolean): string {
  const titles = bigWin
    ? ["MEGA CAT WIN!", "BIG CAT WIN!", "LUCKY CAT WIN!"]
    : ["CAT WIN!", "NICE WIN!", "LUCKY HIT!"];

  return titles[frameIndex % titles.length] ?? titles[0] ?? "WIN!";
}

function buildPanel(
  totalWin: number,
  frameIndex: number,
  bigWin: boolean,
): readonly string[] {
  const pulseColor = getPulseColor(frameIndex);
  const shownValue = getCountUpValue(totalWin, frameIndex);
  const title = getTitle(frameIndex, bigWin);

  const titleText = centerText(title, PANEL_WIDTH);
  const amountText = centerText(`+${shownValue}`, PANEL_WIDTH);

  const subline = bigWin
    ? centerText("coins raining from the sky", PANEL_WIDTH)
    : centerText("the cat approves this spin", PANEL_WIDTH);

  const pulseLine =
    frameIndex % 2 === 0
      ? centerText("*  +  *  +  *", PANEL_WIDTH)
      : centerText("+  *  +  *  +", PANEL_WIDTH);

  return [
    frameTop(PANEL_WIDTH, frameIndex, bigWin),
    emptyPanelLine(PANEL_WIDTH),
    panelLine(titleText, pulseColor, PANEL_WIDTH),
    emptyPanelLine(PANEL_WIDTH),
    panelLine(amountText, UI.text.success, PANEL_WIDTH),
    emptyPanelLine(PANEL_WIDTH),
    panelLine(subline, UI.text.muted, PANEL_WIDTH),
    emptyPanelLine(PANEL_WIDTH),
    panelLine(pulseLine, UI.text.accent, PANEL_WIDTH),
    emptyPanelLine(PANEL_WIDTH),
    frameBottom(PANEL_WIDTH, frameIndex, bigWin),
  ];
}

export function renderWinPresentation(
  totalWin: number,
  frameIndex: number,
  bigWin: boolean,
): readonly string[] {
  const aura = getAuraLines(frameIndex, bigWin);
  const cat = getAnimatedCat(frameIndex, bigWin);
  const panel = buildPanel(totalWin, frameIndex, bigWin);

  return [
    "",
    ...aura,
    "",
    ...cat,
    "",
    ...panel,
    "",
    ...aura.slice().reverse(),
    "",
  ];
}
