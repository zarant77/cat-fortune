![Cat Fortune](./logo.png)

# 🐱 Cat Fortune

A deterministic slot machine prototype built as a showcase project.

Focus:

- clean architecture
- deterministic simulation
- separation of logic and rendering
- reproducible math (RTP, hit rate)

---

## 🎮 Concept

Classic slot machine with a cat-themed twist:

Symbols:

- 🐭 Mouse
- 🧶 Yarn
- 🥛 Milk
- 🐾 Paw
- 🐟 Fish
- 🐔 Chicken
- 😼 Cat
- 🦁 Lion
- 💥 Wild

---

## 🧠 Architecture

Monorepo (npm workspaces):

- `@cat-fortune/core` — deterministic game logic (no rendering)
- `@cat-fortune/config` — reels, symbols, paylines, paytables
- `@cat-fortune/cli` — terminal client

Core is fully deterministic and reusable across platforms:

- CLI
- Web (Phaser / Three.js)
- automated simulations (RTP tests)

---

## 🔁 Determinism

The core uses a seeded RNG, meaning:

- same seed → identical results
- reproducible simulations
- easy debugging & balancing

This allows running controlled RTP simulations and comparing configs precisely.

---

## 📊 RTP Simulation

### Single-seed (deterministic run)

Runs a simulation with a fixed seed (useful for comparing configs):

```bash
npm run rtp
```

Outputs:

- RTP (Return To Player)
- Hit Rate

---

### Multi-seed (statistical analysis)

Runs multiple simulations with different seeds and aggregates results:

```bash
npm run rtp:multi-seed
```

Outputs:

- Avg RTP
- Min / Max RTP
- Avg Hit Rate

This gives a more realistic estimation of slot behavior.

---

## 🚀 Run

Install dependencies:

```bash
npm install
```

Build all packages:

```bash
npm run build
```

Run CLI version:

```bash
npm run dev:cli
```

---

## 🛠 Scripts

Available root scripts:

```bash
npm run build            # build all workspaces
npm run lint             # eslint
npm run typecheck        # typescript project build check

npm run dev:cli          # run CLI client
npm run dev:phaser       # run Phaser client (if implemented)

npm run rtp              # single-seed RTP simulation
npm run rtp:multi-seed   # multi-seed RTP simulation
```

---

## 🧩 Design Goals

- deterministic core (no hidden randomness)
- pure game logic separated from UI
- easy to plug into different renderers
- suitable for simulations and balancing

---

## 📌 Notes

This project is intentionally minimal and focused on:

- architecture
- math correctness
- reproducibility

Not on production-ready visuals or content.

---

## 💡 Future Ideas

- volatility analysis
- win distribution (histograms)
- bonus mechanics (free spins, multipliers)
- web demo (Phaser / Three.js)
