import Phaser from 'phaser'

/**
 * Fighter — Base class for all playable characters.
 *
 * Extends Phaser.GameObjects.Sprite to get:
 *   - Texture / animation management
 *   - Scene graph integration (add to scene, depth ordering)
 *
 * Animation State Machine prevents illegal transitions
 * (e.g., can't interrupt death, can't interrupt attack mid-swing).
 *
 * To add a new character, create a subclass (or config object) and
 * call Fighter.create(scene, config) — zero boilerplate needed here.
 */

import {
  GRAVITY,
  MOVE_SPEED,
  JUMP_VELOCITY,
  GROUND_Y,
  CANVAS_HEIGHT,
  INITIAL_HEALTH,
  FIGHTER_STATE,
} from '../constants/GameConstants.js'

export class Fighter extends Phaser.GameObjects.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {object} config
   * @param {number}  config.x
   * @param {number}  config.y
   * @param {string}  config.texturePrefix  — e.g. 'mack' or 'kenji'
   * @param {boolean} [config.flipX]        — true for right-facing character
   * @param {object}  config.hitboxOffset   — { x, y, w, h } relative to sprite
   * @param {object}  config.hurtboxSize    — { w, h }
   * @param {number}  config.scale
   */
  constructor(scene, config) {
    super(scene, config.x, config.y, config.texturePrefix + '_idle')

    scene.add.existing(this)

    this._prefix      = config.texturePrefix
    this._hitboxOff   = config.hitboxOffset   // { x, y, w, h }
    this._hurtboxSize = config.hurtboxSize    // { w, h }
    this._facingRight      = config.facingRight ?? false
    this._assetFacingRight = config.assetFacingRight ?? true
    this._scale            = config.scale ?? 2.5

    this.setScale(this._scale)
    this.setOrigin(0.5, 1)  // y = bottom of sprite frame = feet on ground
    this._updateFlip()
    this.setDepth(1)

    // Physics / movement state
    this._vy       = 0
    this._vx       = 0
    this._onGround = true

    // Combat state
    this.health      = INITIAL_HEALTH
    this.isAttacking = false
    this.isDead      = false

    // Animation tracking
    this._state        = FIGHTER_STATE.IDLE
    this._pendingState = null

    // Start idle
    this.play(this._animKey(FIGHTER_STATE.IDLE))

    // Listen for animation complete events
    this.on('animationcomplete', this._onAnimComplete, this)
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /** Move left / right. Call every frame. */
  move(direction) {
    if (this.isDead) return
    if (direction === 0) {
      this._vx = 0
    } else {
      this._vx = direction * MOVE_SPEED
    }
  }

  /** Trigger a jump (only if on ground). */
  jump() {
    if (this.isDead || !this._onGround) return
    this._vy = JUMP_VELOCITY
    this._onGround = false
  }

  /** Trigger an attack. */
  attack() {
    if (this.isDead || this.isAttacking) return
    this.isAttacking = true
    this._setState(FIGHTER_STATE.ATTACK, true)
  }

  /** Called by CombatSystem when this fighter is hit. */
  receiveHit(damage) {
    if (this.isDead) return

    this.health = Math.max(0, this.health - damage)

    if (this.health <= 0) {
      this._die()
    } else {
      this._setState(FIGHTER_STATE.TAKEHIT, true)
    }
  }

  /**
   * Returns the world-space hitbox rectangle (the attack box).
   * @returns {{ x, y, width, height }}
   */
  getHitbox() {
    if (this._facingRight) {
      return {
        x:      this.x + this._hitboxOff.x,
        y:      this.y + this._hitboxOff.y,
        width:  this._hitboxOff.w,
        height: this._hitboxOff.h,
      }
    } else {
      return {
        x:      this.x - this._hitboxOff.x - this._hitboxOff.w,
        y:      this.y + this._hitboxOff.y,
        width:  this._hitboxOff.w,
        height: this._hitboxOff.h,
      }
    }
  }

  /**
   * Returns the world-space hurtbox rectangle (the body that can be hit).
   * @returns {{ x, y, width, height }}
   */
  getHurtbox() {
    return {
      x:      this.x - this._hurtboxSize.w / 2,
      y:      this.y - this._hurtboxSize.h,
      width:  this._hurtboxSize.w,
      height: this._hurtboxSize.h,
    }
  }

  /**
   * Current animation frame index (used by CombatSystem for frame windows).
   */
  get framesCurrent() {
    return this.anims.currentFrame ? this.anims.currentFrame.index - 1 : 0
  }

  // ─── Update loop ───────────────────────────────────────────────────────────

  /** Call from GameScene.update() every frame. */
  update(delta) {
    if (this.isDead) return

    const dt = delta / 1000

    // Apply gravity
    this._vy += GRAVITY * dt

    // Apply velocity
    this.x += this._vx * dt
    this.y += this._vy * dt

    // Ground check
    if (this.y >= GROUND_Y) {
      this.y       = GROUND_Y
      this._vy     = 0
      this._onGround = true
    }

    // Clamp to canvas edges
    const halfW = (this._hurtboxSize.w * this._scale) / 2
    this.x = Phaser.Math.Clamp(this.x, halfW, 1024 - halfW)

    // Update facing based on horizontal velocity (not during attack)
    if (this._vx !== 0 && !this.isAttacking && !this.isDead) {
      this._facingRight = this._vx > 0
      this._updateFlip()
    }

    // Animation state from movement
    if (!this.isAttacking && this._state !== FIGHTER_STATE.TAKEHIT) {
      if (!this._onGround && this._vy < 0) {
        this._setState(FIGHTER_STATE.JUMP)
      } else if (!this._onGround && this._vy > 0) {
        this._setState(FIGHTER_STATE.FALL)
      } else if (this._vx !== 0) {
        this._setState(FIGHTER_STATE.RUN)
      } else {
        this._setState(FIGHTER_STATE.IDLE)
      }
    }
  }

  /**
   * Auto-flip to face the opponent.
   * @param {Fighter} opponent
   */
  faceOpponent(opponent) {
    if (this.isDead || this.isAttacking) return
    this._facingRight = opponent.x > this.x
    this._updateFlip()
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  _die() {
    this.isDead      = true
    this.isAttacking = false
    this._vx         = 0
    this._setState(FIGHTER_STATE.DEATH, true)
  }

  /**
   * Switch animation state.
   * @param {string}  newState
   * @param {boolean} [force]   — bypass priority rules
   */
  _setState(newState, force = false) {
    if (this._state === newState) return

    // Priority rules (cannot interrupt):
    if (!force) {
      if (this._state === FIGHTER_STATE.DEATH)   return
      if (this._state === FIGHTER_STATE.ATTACK)  return
      if (this._state === FIGHTER_STATE.TAKEHIT) return
    }

    this._state = newState
    this.play(this._animKey(newState), true)
  }

  _onAnimComplete(anim) {
    const key = anim.key

    if (key === this._animKey(FIGHTER_STATE.ATTACK)) {
      this.isAttacking = false
      this._state = FIGHTER_STATE.IDLE
      this.play(this._animKey(FIGHTER_STATE.IDLE), true)
    }

    if (key === this._animKey(FIGHTER_STATE.TAKEHIT)) {
      this._state = FIGHTER_STATE.IDLE
      this.play(this._animKey(FIGHTER_STATE.IDLE), true)
    }
  }

  /** Build animation key string: e.g. 'mack_idle' */
  _animKey(state) {
    return `${this._prefix}_${state}`
  }

  _updateFlip() {
    this.setFlipX(this._facingRight !== this._assetFacingRight)
  }
}
