import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import LoadingScene from "./scenes/LoadingScene";
import LoginScene from "./scenes/LoginScene";
import MainScene from "./scenes/MainScene";
import SwipePlugin from "phaser3-swipe-plugin";

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
  plugins: {
    global: [
      {
        key: "SwipePlugin",
        plugin: SwipePlugin,
        start: true,
        // custom options
        data: {
          // you can give your value for min offset
          offset: 50,
        },
      },
    ],
  },
};

export default new Phaser.Game(config);
