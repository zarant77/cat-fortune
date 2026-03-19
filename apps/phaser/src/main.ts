import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#0f1117",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  scene: [BootScene]
};

new Phaser.Game(config);
