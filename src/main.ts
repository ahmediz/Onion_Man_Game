import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import LoadingScene from "./scenes/LoadingScene";
import LoginScene from "./scenes/LoginScene";

import MainScene from "./scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 1,
  },
  title: "Onion Man",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [LoadingScene, MainScene, LoginScene, GameScene],
};

export default new Phaser.Game(config);
