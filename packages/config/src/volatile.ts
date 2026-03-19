import type { SlotConfig } from "@cat-fortune/core";

export default {
  name: "Math Volatile",
  rows: 3,
  wildSymbol: "WILD",
  reels: [
    ["LOW_1", "LOW_2", "LOW_3", "LOW_4", "MID_1", "LOW_1", "LOW_2"],
    ["LOW_4", "LOW_1", "LOW_2", "MID_2", "LOW_3", "LOW_1", "WILD"],
    ["LOW_3", "LOW_2", "LOW_1", "MID_1", "LOW_4", "LOW_2", "WILD"],
    ["LOW_4", "MID_2", "LOW_3", "LOW_1", "HIGH_1", "LOW_2", "WILD"],
    ["MID_1", "LOW_2", "LOW_4", "HIGH_2", "LOW_3", "LOW_1", "WILD"],
  ],
  paylines: [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2],
  ],
  paytable: {
    LOW_1: { 3: 4, 4: 10, 5: 25 },
    LOW_2: { 3: 4, 4: 10, 5: 25 },
    LOW_3: { 3: 5, 4: 12, 5: 30 },
    LOW_4: { 3: 5, 4: 12, 5: 30 },
    MID_1: { 3: 8, 4: 20, 5: 60 },
    MID_2: { 3: 8, 4: 20, 5: 60 },
    HIGH_1: { 3: 25, 4: 80, 5: 350 },
    HIGH_2: { 3: 25, 4: 80, 5: 350 },
  },
} as SlotConfig;
