/**
 * GameScene — core game loop.
 *
 * Responsibilities:
 *  - Create background, shop decoration
 *  - Spawn fighters
 *  - Wire up InputSystem, CombatSystem, TimerSystem
 *  - Drive HUD updates
 *  - Detect game-over condition
 *
 * Intentionally thin — combat logic lives in CombatSystem,
 * timer logic in TimerSystem, display in HUD.
 */

import { SCENES, ASSETS, CANVAS_WIDTH, CANVAS_HEIGHT, GAME_DURATION } from '../constants/GameConstants.js'
import { InputSystem, INPUT_MAPS } from '../systems/InputSystem.js'
import { CombatSystem }             from '../systems/CombatSystem.js'
import { TimerSystem }              from '../systems/TimerSystem.js'
import { HUD }                      from '../ui/HUD.js'
import { createSamuraiMack, MACK_ANIMATIONS } from '../fighters/SamuraiMack.js'
import { createKenji, KENJI_ANIMATIONS }       from '../fighters/Kenji.js'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME })
  }

  create() {
    // Show HUD
    document.getElementById('hud').style.display     = 'flex'
    document.getElementById('controls-hint').style.display = 'flex'
    document.getElementById('game-over-overlay').classList.remove('visible')

    this._gameOver = false

    // ── Background ─────────────────────────────────────────────────────────
    this.add.image(0, 0, ASSETS.BACKGROUND).setOrigin(0, 0)

    // White tint overlay (matches original feel)
    const tint = this.add.graphics()
    tint.fillStyle(0xffffff, 0.15)
    tint.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // ── Animated shop decoration ───────────────────────────────────────────
    if (!this.anims.exists('shop_anim_game')) {
      this.anims.create({
        key:       'shop_anim_game',
        frames:    this.anims.generateFrameNumbers(ASSETS.SHOP, { start: 0, end: 5 }),
        frameRate: 8,
        repeat:    -1,
      })
    }
    this.add.sprite(600, 480, ASSETS.SHOP)
      .setOrigin(0, 1)   // anchor at bottom-left, matching original draw position
      .setScale(2.75)
      .setDepth(0)
      .play('shop_anim_game')

    // ── Ground line (visual reference) ─────────────────────────────────────
    const ground = this.add.graphics()
    ground.lineStyle(1, 0xffffff, 0.08)
    ground.lineBetween(0, 330, CANVAS_WIDTH, 330)
    ground.setDepth(0)

    // ── Animations ─────────────────────────────────────────────────────────
    this._registerAnimations()

    // ── Fighters ───────────────────────────────────────────────────────────
    this._player1 = createSamuraiMack(this)
    this._player2 = createKenji(this)

    this._player1.setDepth(2)
    this._player2.setDepth(2)

    // ── Input ──────────────────────────────────────────────────────────────
    this._input1 = new InputSystem(this, INPUT_MAPS.PLAYER1)
    this._input2 = new InputSystem(this, INPUT_MAPS.PLAYER2)

    // ── HUD ────────────────────────────────────────────────────────────────
    this._hud = new HUD()
    this._hud.setPlayer1Health(100)
    this._hud.setPlayer2Health(100)

    // ── Timer ──────────────────────────────────────────────────────────────
    this._timer = new TimerSystem(
      this,
      GAME_DURATION,
      (remaining) => this._hud.setTimer(remaining),
      ()          => this._endGame(),
    )

    // ── Audio ──────────────────────────────────────────────────────────────
    this.sound.play(ASSETS.MUSIC, { loop: true, volume: 0.5 })

    // ── Camera fade-in ─────────────────────────────────────────────────────
    this.cameras.main.fadeIn(400)
  }

  update(_time, delta) {
    if (this._gameOver) return

    // ── Read input ─────────────────────────────────────────────────────────
    const in1 = this._input1.getState()
    const in2 = this._input2.getState()

    // ── Apply input to fighters ────────────────────────────────────────────
    if (!this._player1.isDead) {
      const dir1 = in1.right ? 1 : in1.left ? -1 : 0
      this._player1.move(dir1)
      if (in1.jump)   this._player1.jump()
      if (in1.attack) this._player1.attack()
    }

    if (!this._player2.isDead) {
      const dir2 = in2.right ? 1 : in2.left ? -1 : 0
      this._player2.move(dir2)
      if (in2.jump)   this._player2.jump()
      if (in2.attack) this._player2.attack()
    }

    // ── Update fighters (physics + animation) ─────────────────────────────
    this._player1.update(delta)
    this._player2.update(delta)

    // ── Auto-face opponent ─────────────────────────────────────────────────
    this._player1.faceOpponent(this._player2)
    this._player2.faceOpponent(this._player1)

    // ── Hitbox flipping based on facing ───────────────────────────────────
    // (handled inside Fighter.getHitbox via _facingRight)

    // ── Combat ────────────────────────────────────────────────────────────
    const { p1Hit, p2Hit } = CombatSystem.update(this._player1, this._player2)

    if (p1Hit) {
      this._hud.setPlayer2Health(this._player2.health)
      this.sound.play(ASSETS.HIT_SFX)
    }
    if (p2Hit) {
      this._hud.setPlayer1Health(this._player1.health)
      this.sound.play(ASSETS.HIT_SFX)
    }

    // ── Check game-over via health ─────────────────────────────────────────
    if (this._player1.health <= 0 || this._player2.health <= 0) {
      this._endGame()
    }
  }

  // ── Private ────────────────────────────────────────────────────────────────

  _endGame() {
    if (this._gameOver) return
    this._gameOver = true

    this._timer.stop()

    // Stop fighters
    this._player1.move(0)
    this._player2.move(0)

    // Determine winner
    let result
    if (this._player1.health === this._player2.health) {
      result = 'TIE'
    } else if (this._player1.health > this._player2.health) {
      result = 'PLAYER 1 WINS!'
    } else {
      result = 'PLAYER 2 WINS!'
    }

    // Brief delay then show overlay
    this.time.delayedCall(800, () => {
      const overlay = document.getElementById('game-over-overlay')
      document.getElementById('result-text').textContent = result
      overlay.classList.add('visible')

      // Wire restart button
      document.getElementById('restart-btn').onclick = () => {
        this._restartGame()
      }
    })
  }

  _restartGame() {
    this._input1.destroy()
    this._input2.destroy()
    this.sound.stopAll()
    document.getElementById('game-over-overlay').classList.remove('visible')
    this.cameras.main.fadeOut(300, 0, 0, 0)
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.restart()
    })
  }

  _registerAnimations() {
    // Register each animation only once (in case of scene restart)
    const register = (animDefs, prefix) => {
      for (const def of animDefs) {
        if (!this.anims.exists(def.key)) {
          this.anims.create({
            key:        def.key,
            frames:     this.anims.generateFrameNumbers(def.key, { start: 0, end: def.frames - 1 }),
            frameRate:  def.frameRate,
            repeat:     def.repeat,
          })
        }
      }
    }

    register(MACK_ANIMATIONS,  'mack')
    register(KENJI_ANIMATIONS, 'kenji')
  }
}
