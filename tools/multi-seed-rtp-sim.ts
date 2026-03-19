import { spinOnce, createInitialState } from "@cat-fortune/core";
import { allConfigs } from "@cat-fortune/config";

const SPINS = 100_000;
const BET = 5;

const SEEDS = Array.from({ length: 10 }, (_, i) => 12345 + i);

for (const config of allConfigs) {
  let totalRtp = 0;
  let totalHitRate = 0;

  let minRtp = Infinity;
  let maxRtp = -Infinity;

  for (const seed of SEEDS) {
    let state = createInitialState(seed);

    let totalBet = 0;
    let totalWin = 0;
    let hits = 0;

    for (let i = 0; i < SPINS; i += 1) {
      const next = spinOnce(config, state);
      const spin = next.lastSpin;

      if (spin === null) {
        throw new Error(`No spin result for config: ${config.name}`);
      }

      totalBet += BET;
      totalWin += spin.totalWin;

      if (spin.totalWin > 0) {
        hits += 1;
      }

      state = next;
    }

    const rtp = totalWin / totalBet;
    const hitRate = hits / SPINS;

    totalRtp += rtp;
    totalHitRate += hitRate;

    if (rtp < minRtp) minRtp = rtp;
    if (rtp > maxRtp) maxRtp = rtp;
  }

  const avgRtp = totalRtp / SEEDS.length;
  const avgHitRate = totalHitRate / SEEDS.length;

  console.log(`=== ${config.name} ===`);
  console.log("Seeds:", SEEDS.length);
  console.log("Spins per seed:", SPINS);

  console.log("Avg RTP:", avgRtp.toFixed(4));
  console.log("Min RTP:", minRtp.toFixed(4));
  console.log("Max RTP:", maxRtp.toFixed(4));

  console.log("Avg Hit Rate:", avgHitRate.toFixed(4));
  console.log("");
}
