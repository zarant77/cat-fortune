import { spinOnce, createInitialState } from "@cat-fortune/core";
import { allConfigs } from "@cat-fortune/config";

const SPINS = 100_000;
const BET = 5;

for (const config of allConfigs) {
  let state = createInitialState(12345);

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

  console.log(`=== ${config.name} ===`);
  console.log("Spins:", SPINS);
  console.log("RTP:", rtp.toFixed(4));
  console.log("Hit Rate:", hitRate.toFixed(4));
  console.log("");
}
