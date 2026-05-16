/**
 * BootScene — loads all assets before anything else runs.
 *
 * This is the first scene that runs. It displays a loading bar
 * while all spritesheets and images are loaded, then transitions
 * to MenuScene.
 */

import { SCENES, ASSETS } from '../constants/GameConstants.js'
import { MACK_SPRITESHEETS } from '../fighters/SamuraiMack.js'
import { KENJI_SPRITESHEETS } from '../fighters/Kenji.js'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT })
  }

  preload() {
    this._createLoadingBar()

    // ── Background / decoration images ────────────────────────────────────
    this.load.image(ASSETS.BACKGROUND, 'assets/img/background.png')
    this.load.spritesheet(ASSETS.SHOP, 'assets/img/shop.png', {
      frameWidth: 118,
      frameHeight: 128
    })

    // ── SamuraiMack spritesheets ───────────────────────────────────────────
    for (const sheet of MACK_SPRITESHEETS) {
      this.load.spritesheet(sheet.key, sheet.path, {
        frameWidth: sheet.frameW,
        frameHeight: sheet.frameH
      })
    }

    // ── Kenji spritesheets ─────────────────────────────────────────────────
    for (const sheet of KENJI_SPRITESHEETS) {
      this.load.spritesheet(sheet.key, sheet.path, {
        frameWidth: sheet.frameW,
        frameHeight: sheet.frameH
      })
    }

    // ── Audio ──────────────────────────────────────────────────────────────
    this.load.audio(ASSETS.MUSIC, 'assets/audio/music.mp3')
    this.load.audio(ASSETS.SWING_SFX, 'assets/audio/SoundEffect/swing.wav')
    this.load.audio(ASSETS.HIT_SFX, 'assets/audio/SoundEffect/hit1.mp3')
    this.load.audio(ASSETS.BLOCK1_SFX, 'assets/audio/SoundEffect/block1.mp3')
    this.load.audio(ASSETS.BLOCK2_SFX, 'assets/audio/SoundEffect/block2.mp3')

    // Progress bar
    this.load.on('progress', (value) => {
      this._progressBar.clear()
      this._progressBar.fillStyle(0x818cf8)
      this._progressBar.fillRect(212, 283, 600 * value, 14)
    })

    this.load.on('complete', () => {
      this._barContainer.destroy()
      this._progressBar.destroy()
      this._loadText.destroy()
    })
  }

  create() {
    this.scene.start(SCENES.MENU)
  }

  // ── Private ────────────────────────────────────────────────────────────────

  _createLoadingBar() {
    const { width, height } = this.cameras.main

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0a)

    // Title
    this.add
      .text(width / 2, height / 2 - 80, 'SAMURAI DUEL', {
        fontFamily: "'Press Start 2P'",
        fontSize: '28px',
        color: '#818cf8'
      })
      .setOrigin(0.5)

    // Loading text
    this._loadText = this.add
      .text(width / 2, height / 2 + 40, 'Loading...', {
        fontFamily: "'Press Start 2P'",
        fontSize: '10px',
        color: '#94a3b8'
      })
      .setOrigin(0.5)

    // Bar container
    this._barContainer = this.add.graphics()
    this._barContainer.lineStyle(2, 0xffffff)
    this._barContainer.strokeRect(210, 280, 604, 20)

    // Progress fill
    this._progressBar = this.add.graphics()
  }
}
