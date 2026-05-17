/**
 * MenuScene — main menu / title screen.
 *
 * Displays the game title, character names, controls, and a
 * "Press ENTER to play" prompt. Fades into GameScene.
 */

import { SCENES, ASSETS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/GameConstants.js'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU })
  }

  create() {
    // Hide DOM HUD while in menu
    document.getElementById('hud').style.display = 'none'
    document.getElementById('controls-hint').style.display = 'none'
    document.getElementById('game-over-overlay').classList.remove('visible')

    const { width, height } = this.cameras.main

    // ── Background ─────────────────────────────────────────────────────────
    this.add.image(0, 0, ASSETS.BACKGROUND).setOrigin(0, 0).setAlpha(0.35)

    // Dark gradient overlay
    const overlay = this.add.graphics()
    overlay.fillGradientStyle(0x000000, 0x000000, 0x000014, 0x000014, 1, 1, 0.5, 0.5)
    overlay.fillRect(0, 0, width, height)

    // ── Animated shop sprite ───────────────────────────────────────────────
    this.anims.create({
      key:       'shop_anim',
      frames:    this.anims.generateFrameNumbers(ASSETS.SHOP, { start: 0, end: 5 }),
      frameRate: 8,
      repeat:    -1,
    })
    this.add.sprite(600, 480, ASSETS.SHOP)
      .setOrigin(0, 1)
      .setScale(2.75)
      .play('shop_anim')
      .setAlpha(0.5)

    // ── Title ──────────────────────────────────────────────────────────────
    const titleGlow = this.add.text(width / 2 + 2, 112, 'SAMURAI DUEL', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '34px',
      color:      '#4f46e5',
    }).setOrigin(0.5).setAlpha(0.6)

    const title = this.add.text(width / 2, 110, 'SAMURAI DUEL', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '34px',
      color:      '#e2e8f0',
    }).setOrigin(0.5)

    this.tweens.add({
      targets:    [title, titleGlow],
      y:          '+=8',
      duration:   1800,
      yoyo:       true,
      repeat:     -1,
      ease:       'Sine.easeInOut',
    })

    // ── VS banner ──────────────────────────────────────────────────────────
    this.add.text(width / 2, 200, 'VS', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '22px',
      color:      '#818cf8',
    }).setOrigin(0.5)

    this.add.text(width / 2 - 160, 200, 'SAMURAI', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '11px',
      color:      '#94a3b8',
    }).setOrigin(1, 0.5)

    this.add.text(width / 2 + 160, 200, 'KENJI', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '11px',
      color:      '#94a3b8',
    }).setOrigin(0, 0.5)

    // ── Controls panel ─────────────────────────────────────────────────────
    const panelX = width / 2
    const panelY = 300

    this._drawPanel(panelX - 220, panelY, 'PLAYER 1', [
      'A / D   →  Move',
      'W       →  Jump',
      'SPACE   →  Attack',
      '🎮  L.Stick → Move/Jump',
      '🎮  × Button → Attack',
    ], '#818cf8')

    this._drawPanel(panelX + 220, panelY, 'PLAYER 2', [
      '← / →   →  Move',
      '↑       →  Jump',
      '↓       →  Attack',
      '🎮  2nd gamepad',
    ], '#f472b6')

    // ── Press ENTER ────────────────────────────────────────────────────────
    const pressEnter = this.add.text(width / 2, 470, '▶  PRESS ENTER / 🎮 △ TO FIGHT', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '12px',
      color:      '#fff',
    }).setOrigin(0.5)

    this.tweens.add({
      targets:  pressEnter,
      alpha:    0,
      duration: 600,
      yoyo:     true,
      repeat:   -1,
      ease:     'Power2',
    })

    // Version
    this.add.text(width - 10, height - 10, 'v2.0  Phaser 3', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '6px',
      color:      '#334155',
    }).setOrigin(1, 1)

    // ── Input ──────────────────────────────────────────────────────────────
    const startGame = () => {
      if (this._started) return
      this._started = true
      this.cameras.main.fadeOut(400, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.GAME)
      })
    }

    this.input.keyboard.once('keydown-ENTER', startGame)
    this.input.keyboard.once('keydown-SPACE', startGame)

    // Gamepad: poll each frame for △ (Triangle, index 3) or Start (index 9) button
    this._prevAnyButton = false
    this.events.on('update', () => {
      const pads = this.input.gamepad?.gamepads?.filter(p => p && p.connected) ?? []
      const anyPressed = pads.some(
        p => p.buttons[3]?.pressed || p.buttons[9]?.pressed
      )
      if (anyPressed && !this._prevAnyButton) startGame()
      this._prevAnyButton = anyPressed
    })

    this.cameras.main.fadeIn(500)
  }

  // ── Private ────────────────────────────────────────────────────────────────

  _drawPanel(cx, cy, title, lines, color) {
    const panelW = 300
    const panelH = 130
    const g = this.add.graphics()
    g.fillStyle(0x000000, 0.55)
    g.lineStyle(2, parseInt(color.replace('#', '0x')))
    g.fillRoundedRect(cx - panelW / 2, cy - panelH / 2, panelW, panelH, 8)
    g.strokeRoundedRect(cx - panelW / 2, cy - panelH / 2, panelW, panelH, 8)

    this.add.text(cx, cy - 40, title, {
      fontFamily: "'Press Start 2P'",
      fontSize:   '10px',
      color,
    }).setOrigin(0.5)

    lines.forEach((line, i) => {
      this.add.text(cx, cy - 10 + i * 22, line, {
        fontFamily: "'Press Start 2P'",
        fontSize:   '7px',
        color:      '#cbd5e1',
      }).setOrigin(0.5)
    })
  }
}
