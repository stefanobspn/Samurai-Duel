/**
 * Kenji — Player 2 character configuration.
 *
 * Mirror of SamuraiMack.js — just different asset paths,
 * frame counts, and hitbox offsets.
 */

import { ASSETS, FIGHTER_SCALE, FRAME_RATE, GROUND_Y } from '../constants/GameConstants.js'
import { Fighter } from './Fighter.js'

const FRAME_W = 200
const FRAME_H = 200

export const KENJI_ANIMATIONS = [
  { key: ASSETS.KENJI_IDLE,    frames: 4,  frameRate: FRAME_RATE, repeat: -1 },
  { key: ASSETS.KENJI_RUN,     frames: 8,  frameRate: FRAME_RATE, repeat: -1 },
  { key: ASSETS.KENJI_JUMP,    frames: 2,  frameRate: 8,          repeat: 0  },
  { key: ASSETS.KENJI_FALL,    frames: 2,  frameRate: 8,          repeat: 0  },
  { key: ASSETS.KENJI_ATTACK1, frames: 4,  frameRate: FRAME_RATE, repeat: 0  },
  { key: ASSETS.KENJI_TAKEHIT, frames: 3,  frameRate: FRAME_RATE, repeat: 0  },
  { key: ASSETS.KENJI_DEATH,   frames: 7,  frameRate: FRAME_RATE, repeat: 0  },
]

export const KENJI_SPRITESHEETS = [
  { key: ASSETS.KENJI_IDLE,    path: 'img/kenji/Idle.png',     frameW: FRAME_W, frameH: FRAME_H },
  { key: ASSETS.KENJI_RUN,     path: 'img/kenji/Run.png',      frameW: FRAME_W, frameH: FRAME_H },
  { key: ASSETS.KENJI_JUMP,    path: 'img/kenji/Jump.png',     frameW: FRAME_W, frameH: FRAME_H },
  { key: ASSETS.KENJI_FALL,    path: 'img/kenji/Fall.png',     frameW: FRAME_W, frameH: FRAME_H },
  { key: ASSETS.KENJI_ATTACK1, path: 'img/kenji/Attack1.png',  frameW: FRAME_W, frameH: FRAME_H },
  { key: ASSETS.KENJI_TAKEHIT, path: 'img/kenji/Take hit.png', frameW: FRAME_W, frameH: FRAME_H },
  { key: ASSETS.KENJI_DEATH,   path: 'img/kenji/Death.png',    frameW: FRAME_W, frameH: FRAME_H },
]

/**
 * Create a Kenji fighter and add it to the scene.
 * @param {Phaser.Scene} scene
 * @returns {Fighter}
 */
export function createKenji(scene) {
  return new Fighter(scene, {
    x:            820,
    y:            GROUND_Y,
    texturePrefix:'kenji',
    assetFacingRight: false,
    facingRight:      false,   // starts facing left (toward P1)
    scale:            FIGHTER_SCALE,
    // hitboxOffset defined as if facing RIGHT — getHitbox() auto-flips for left-facing
    hitboxOffset: { x: 0, y: -120, w: 170, h: 50 },
    hurtboxSize:  { w: 50, h: 120 },
  })
}
