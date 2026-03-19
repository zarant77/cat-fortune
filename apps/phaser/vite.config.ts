import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    host: true,
    port: 5174,
    strictPort: true
  },
  resolve: {
    alias: {
      "@cat-fortune/core": path.resolve(currentDir, "../../packages/core/src/index.ts"),
      "@cat-fortune/config": path.resolve(currentDir, "../../packages/config/src/index.ts")
    }
  }
});
