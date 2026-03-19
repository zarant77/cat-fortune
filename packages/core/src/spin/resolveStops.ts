import { SeededRandom } from "../random/SeededRandom.js";
import type { ReelStrip } from "../types.js";

export function resolveStops(
  reels: readonly ReelStrip[],
  random: SeededRandom,
): readonly number[] {
  return reels.map((strip, reelIndex) => {
    if (strip.length === 0) {
      throw new Error(`Reel ${reelIndex} is empty`);
    }

    return random.nextInt(strip.length);
  });
}
