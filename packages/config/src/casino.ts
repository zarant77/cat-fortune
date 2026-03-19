import type { SlotConfig } from "@cat-fortune/core";

export default {
  name: "Math Casino",
  rows: 3,
  wildSymbol: "WILD",
  reels: [
    ["LOW_1", "LOW_2", "MID_1", "LOW_3", "HIGH_1", "LOW_4", "WILD"],
    ["LOW_4", "LOW_1", "LOW_2", "MID_2", "LOW_3", "HIGH_2", "WILD"],
    ["LOW_3", "LOW_2", "LOW_1", "MID_1", "HIGH_1", "LOW_4", "WILD"],
    ["LOW_4", "MID_2", "LOW_3", "LOW_1", "LOW_2", "HIGH_2", "WILD"],
    ["MID_1", "LOW_2", "LOW_4", "LOW_3", "LOW_1", "HIGH_1", "WILD"],
  ],
  paylines: [
    [0, 0, 0, 0, 0], // top line
    [1, 1, 1, 1, 1], // mid line
    [2, 2, 2, 2, 2], // bot line
    [0, 1, 2, 1, 0], // v
    [2, 1, 0, 1, 2], // ^
  ],
  paytable: {
    LOW_1: { 3: 6, 4: 15, 5: 38 },
    LOW_2: { 3: 6, 4: 15, 5: 38 },
    LOW_3: { 3: 8, 4: 19, 5: 47 },
    LOW_4: { 3: 8, 4: 19, 5: 47 },
    MID_1: { 3: 11, 4: 28, 5: 85 },
    MID_2: { 3: 11, 4: 28, 5: 85 },
    HIGH_1: { 3: 19, 4: 47, 5: 188 },
    HIGH_2: { 3: 19, 4: 47, 5: 188 },
  },
} as SlotConfig;
