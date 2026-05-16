/**
 * main.js — Phaser 3 game entry point.
 *
 * Creates the Phaser.Game instance with the full scene list.
 * Adding a new scene only requires importing it and adding it here.
 */

import Phaser from 'phaser'
import { CANVAS_WIDTH, CANVAS_HEIGHT, SCENES } from './constants/GameConstants.js'
import { BootScene }    from './scenes/BootScene.js'
import { MenuScene }    from './scenes/MenuScene.js'
import { GameScene }    from './scenes/GameScene.js'

const config = {
  type: Phaser.AUTO,       // WebGL with Canvas fallback
  width:  CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  parent: 'phaser-canvas', // mount into this DOM element
  backgroundColor: '#0a0a0a',

  physics: {
    default: 'arcade',
    arcade: {
      debug: true,         // Set true to see hitboxes during development
    },
  },

  render: {
    antialias:         false, // pixel-art style — keep crisp
    pixelArt:          true,
    roundPixels:       true,
  },

  scene: [
    BootScene,
    MenuScene,
    GameScene,
  ],
}

const game = new Phaser.Game(config)

// Expose restart helper for the DOM restart button
window.gameInstance = {
  restart: () => {
    const gameScene = game.scene.getScene(SCENES.GAME)
    if (gameScene) {
      gameScene._restartGame?.()
    }
  },
}

export default game
