/**
 * InputSystem
 *
 * Decoupled input handler. Each fighter gets its own InputSystem instance.
 * Supports both keyboard and gamepad — gamepad takes priority when connected.
 *
 * Usage:
 *   const input = new InputSystem(scene, INPUT_MAPS.PLAYER1, { gamepadIndex: 0 })
 *   // in update():
 *   const state = input.getState()  // { left, right, jump, attack, dash }
 */

import Phaser from 'phaser'

const { KeyCodes, JustDown } = Phaser.Input.Keyboard

/** Default key maps — use numeric KeyCodes for ESM compatibility */
export const INPUT_MAPS = {
  PLAYER1: {
    left:   KeyCodes.A,
    right:  KeyCodes.D,
    jump:   KeyCodes.W,
    attack: KeyCodes.SPACE,
    dash:   KeyCodes.SHIFT,
  },
  PLAYER2: {
    left:   KeyCodes.LEFT,
    right:  KeyCodes.RIGHT,
    jump:   KeyCodes.UP,
    attack: KeyCodes.DOWN,
    dash:   KeyCodes.M,
  },
}

// ── Gamepad button indices (standard mapping) ────────────────────────────────
// Xbox:  A=0, B=1, X=2, Y=3, LB=4, RB=5, LT=6, RT=7, Select=8, Start=9
// PS:    ×=0, ○=1, □=2, △=3, L1=4, R1=5, L2=6, R2=7, Share=8, Options=9
//
// User mapping:
//   Attack → × (PS Cross, index 0) / A (Xbox, index 0)
//   Jump   → Left stick UP only
//   Move   → Left stick horizontal
const GAMEPAD = {
  BUTTON_CROSS:  0,  // PS ×  / Xbox A  → ATTACK
  BUTTON_CIRCLE: 1,  // PS ○  / Xbox B
  BUTTON_SQUARE: 2,  // PS □  / Xbox X
  BUTTON_TRI:    3,  // PS △  / Xbox Y
  BUTTON_LB:     4,
  BUTTON_RB:     5,
  BUTTON_START:  9,  // Options / Start → start game in menu

  AXIS_LX:       0,  // Left stick horizontal
  AXIS_LY:       1,  // Left stick vertical
  DEADZONE:      0.3,
}

export class InputSystem {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ left, right, jump, attack, dash }} keyMap
   * @param {{ gamepadIndex?: number }} [opts]  gamepadIndex = which pad slot (0 = first connected)
   */
  constructor(scene, keyMap, opts = {}) {
    this._scene        = scene
    this._gamepadIndex = opts.gamepadIndex ?? -1  // -1 = no gamepad for this instance

    // ── Keyboard ───────────────────────────────────────────────────────────
    const kb = scene.input.keyboard
    this._keys = {
      left:   kb.addKey(keyMap.left),
      right:  kb.addKey(keyMap.right),
      jump:   kb.addKey(keyMap.jump),
      attack: kb.addKey(keyMap.attack),
      dash:   kb.addKey(keyMap.dash),
    }

    // ── Gamepad one-shot tracking ──────────────────────────────────────────
    // We need to detect "just pressed" for buttons that should fire once per press.
    this._prevJump   = false
    this._prevAttack = false
    this._prevDash   = false
  }

  /** @returns {Phaser.Input.Gamepad.Gamepad|null} */
  _getGamepad() {
    if (this._gamepadIndex < 0) return null
    const pads = this._scene.input.gamepad?.gamepads
    if (!pads) return null
    // Find the Nth *connected* pad
    const connected = pads.filter(p => p && p.connected)
    return connected[this._gamepadIndex] ?? null
  }

  /**
   * Call once per frame.
   * @returns {{ left: boolean, right: boolean, jump: boolean, attack: boolean, dash: boolean }}
   */
  getState() {
    const pad = this._getGamepad()

    if (pad) {
      // ── Gamepad path ────────────────────────────────────────────────────
      const lx   = pad.axes[GAMEPAD.AXIS_LX]?.getValue() ?? 0
      const ly   = pad.axes[GAMEPAD.AXIS_LY]?.getValue() ?? 0
      const dead = GAMEPAD.DEADZONE

      const gpLeft  = lx < -dead
      const gpRight = lx > dead
      // Jump: left stick UP only (as requested)
      const gpJumpHeld   = ly < -dead
      // Attack: × / Cross (index 0) — PS ×, Xbox A
      const gpAttackHeld = pad.buttons[GAMEPAD.BUTTON_CROSS]?.pressed
      // Dash: button LB / L1 (index 4)
      const gpDashHeld   = pad.buttons[GAMEPAD.BUTTON_LB]?.pressed

      // One-shot detection
      const jump   = gpJumpHeld   && !this._prevJump
      const attack = gpAttackHeld && !this._prevAttack
      const dash   = gpDashHeld   && !this._prevDash

      this._prevJump   = gpJumpHeld
      this._prevAttack = gpAttackHeld
      this._prevDash   = gpDashHeld

      return { left: gpLeft, right: gpRight, jump, attack, dash }
    }

    // ── Keyboard fallback ─────────────────────────────────────────────────
    return {
      left:   this._keys.left.isDown,
      right:  this._keys.right.isDown,
      jump:   JustDown(this._keys.jump),
      attack: JustDown(this._keys.attack),
      dash:   JustDown(this._keys.dash),
    }
  }

  /**
   * Returns true if the gamepad "start" or "A" button was just pressed.
   * Used by MenuScene to start the game via gamepad.
   */
  isStartPressed() {
    const pad = this._getGamepad()
    if (!pad) return false
    return pad.buttons[GAMEPAD.BUTTON_START]?.pressed || pad.buttons[GAMEPAD.BUTTON_A]?.pressed
  }

  /** Whether a gamepad is currently active for this input slot */
  get isGamepadActive() {
    return this._getGamepad() !== null
  }

  destroy() {
    Object.values(this._keys).forEach(k => k.destroy())
  }
}
