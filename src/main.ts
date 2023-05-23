import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.FIT,	
		autoCenter: Phaser.Scale.CENTER_BOTH,
		zoom: 1,
	},
	title: 'Onion Man',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: [HelloWorldScene]
}

export default new Phaser.Game(config)
