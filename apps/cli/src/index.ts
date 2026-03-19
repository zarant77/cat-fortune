import { CliApp } from "./app/CliApp.js";

const app = new CliApp();

process.on("SIGINT", () => {
  app.shutdown();
  process.exit(0);
});

app.run();
