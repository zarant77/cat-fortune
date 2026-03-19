import { SeededRandom } from "../random/SeededRandom.js";
import { buildGrid } from "../spin/buildGrid.js";
import { evaluateSpin } from "../spin/evaluateSpin.js";
import { resolveStops } from "../spin/resolveStops.js";
import type { SlotConfig, SlotState, SpinResult } from "../types.js";

export function createInitialState(seed: number): SlotState {
  return {
    seed: seed >>> 0,
    spinIndex: 0,
    lastSpin: null,
  };
}

export function spinOnce(config: SlotConfig, state: SlotState): SlotState {
  const random = new SeededRandom((state.seed + state.spinIndex) >>> 0);
  const stops = resolveStops(config.reels, random);
  const grid = buildGrid(config.reels, config.rows, stops);
  const wins = evaluateSpin(config, grid);
  const totalWin = wins.reduce((sum, win) => sum + win.payout, 0);

  const result: SpinResult = {
    stops,
    grid,
    wins,
    totalWin,
  };

  return {
    seed: state.seed,
    spinIndex: state.spinIndex + 1,
    lastSpin: result,
  };
}
