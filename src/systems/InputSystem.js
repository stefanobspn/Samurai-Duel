/**
 * InputSystem
 *
 * Decoupled keyboard handler. Each fighter gets its own InputMap
 * so it can be replaced with an AI controller later without touching
 * the fighter or game-loop code.
 *
 * Usage:
 *   const input = new InputSystem(scene, INPUT_MAPS.PLAYER1)
 *   // in update():
 *   const state = input.getState()  // { left, right, jump, attack }
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
  },
  PLAYER2: {
    left:   KeyCodes.LEFT,
    right:  KeyCodes.RIGHT,
    jump:   KeyCodes.UP,
    attack: KeyCodes.DOWN,
  },
}

export class InputSystem {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ left, right, jump, attack }} keyMap  — Phaser.Input.Keyboard.KeyCodes values
   */
  constructor(scene, keyMap) {
    const kb = scene.input.keyboard

    this._keys = {
      left:   kb.addKey(keyMap.left),
      right:  kb.addKey(keyMap.right),
      jump:   kb.addKey(keyMap.jump),
      attack: kb.addKey(keyMap.attack),
    }
  }

  /**
   * Call once per frame.
   * @returns {{ left: boolean, right: boolean, jump: boolean, attack: boolean }}
   */
  getState() {
    return {
      left:   this._keys.left.isDown,
      right:  this._keys.right.isDown,
      jump:   JustDown(this._keys.jump),
      attack: JustDown(this._keys.attack),
    }
  }

  destroy() {
    // Clean up Phaser key listeners
    Object.values(this._keys).forEach(k => k.destroy())
  }
}
