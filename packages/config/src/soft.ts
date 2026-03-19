import type { SlotConfig } from "@cat-fortune/core";

export default {
  name: "Math Soft",
  rows: 3,
  wildSymbol: "WILD",
  reels: [
    ["LOW_1", "LOW_2", "LOW_3", "LOW_4", "MID_1", "LOW_1", "WILD"],
    ["LOW_4", "LOW_1", "LOW_2", "MID_2", "LOW_3", "WILD", "LOW_2"],
    ["LOW_3", "LOW_2", "LOW_1", "MID_1", "LOW_4", "WILD", "LOW_3"],
    ["LOW_4", "MID_2", "LOW_3", "LOW_1", "LOW_2", "WILD", "LOW_4"],
    ["MID_1", "LOW_2", "LOW_4", "LOW_3", "LOW_1", "WILD", "LOW_2"],
  ],
  paylines: [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2],
  ],
  paytable: {
    LOW_1: { 3: 7, 4: 17, 5: 42 },
    LOW_2: { 3: 7, 4: 17, 5: 42 },
    LOW_3: { 3: 9, 4: 21, 5: 50 },
    LOW_4: { 3: 9, 4: 21, 5: 50 },
    MID_1: { 3: 13, 4: 32, 5: 90 },
    MID_2: { 3: 13, 4: 32, 5: 90 },
    HIGH_1: { 3: 20, 4: 50, 5: 200 },
    HIGH_2: { 3: 20, 4: 50, 5: 200 },
  },
} as SlotConfig;
