import type { SlotConfig } from "@cat-fortune/core";

export default {
  name: "Math Balanced",
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
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2],
  ],
  paytable: {
    LOW_1: { 3: 7, 4: 16, 5: 40 },
    LOW_2: { 3: 7, 4: 16, 5: 40 },
    LOW_3: { 3: 9, 4: 20, 5: 49 },
    LOW_4: { 3: 9, 4: 20, 5: 49 },

    MID_1: { 3: 12, 4: 30, 5: 90 },
    MID_2: { 3: 12, 4: 30, 5: 90 },

    HIGH_1: { 3: 20, 4: 50, 5: 195 },
    HIGH_2: { 3: 20, 4: 50, 5: 195 },
  },
} as SlotConfig;
