import Phaser from "phaser";

import MainScene from "./scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 1,
  },
  dom: {
    createContainer: true,
  },
  parent: "canvas",
  backgroundColor: "red",
  title: "Onion Man",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [MainScene],
};

export default new Phaser.Game(config);
