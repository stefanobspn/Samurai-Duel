/**
 * SamuraiMack — Player 1 character configuration.
 *
 * All character-specific data lives here:
 *   - Sprite sheet frame counts & sizes
 *   - Hitbox / hurtbox dimensions
 *   - Starting position
 *
 * To add a new character, copy this file and adjust the values.
 */

import {
  ASSETS,
  FIGHTER_STATE,
  FIGHTER_SCALE,
  FRAME_RATE,
  GROUND_Y
} from '../constants/GameConstants.js'
import { Fighter } from './Fighter.js'

// ── Sprite frame dimensions (pixels per frame in each sheet) ─────────────────
const FRAME_W = 200
const FRAME_H = 200

// ── Animation definitions ────────────────────────────────────────────────────
export const MACK_ANIMATIONS = [
  { key: ASSETS.MACK_IDLE, frames: 8, frameRate: FRAME_RATE, repeat: -1 },
  { key: ASSETS.MACK_RUN, frames: 8, frameRate: FRAME_RATE, repeat: -1 },
  { key: ASSETS.MACK_JUMP, frames: 2, frameRate: 8, repeat: 0 },
  { key: ASSETS.MACK_FALL, frames: 2, frameRate: 8, repeat: 0 },
  { key: ASSETS.MACK_ATTACK1, frames: 6, frameRate: FRAME_RATE, repeat: 0 },
  { key: ASSETS.MACK_TAKEHIT, frames: 4, frameRate: FRAME_RATE, repeat: 0 },
  { key: ASSETS.MACK_DEATH, frames: 6, frameRate: FRAME_RATE, repeat: 0 }
]

// ── Sprite sheet load config (used in BootScene) ─────────────────────────────
export const MACK_SPRITESHEETS = [
  {
    key: ASSETS.MACK_IDLE,
    path: 'assets/img/samuraiMack/Idle.png',
    frameW: FRAME_W,
    frameH: FRAME_H
  },
  {
    key: ASSETS.MACK_RUN,
    path: 'assets/img/samuraiMack/Run.png',
    frameW: FRAME_W,
    frameH: FRAME_H
  },
  {
    key: ASSETS.MACK_JUMP,
    path: 'assets/img/samuraiMack/Jump.png',
    frameW: FRAME_W,
    frameH: FRAME_H
  },
  {
    key: ASSETS.MACK_FALL,
    path: 'assets/img/samuraiMack/Fall.png',
    frameW: FRAME_W,
    frameH: FRAME_H
  },
  {
    key: ASSETS.MACK_ATTACK1,
    path: 'assets/img/samuraiMack/Attack1.png',
    frameW: FRAME_W,
    frameH: FRAME_H
  },
  {
    key: ASSETS.MACK_TAKEHIT,
    path: 'assets/img/samuraiMack/Take Hit - white silhouette.png',
    frameW: FRAME_W,
    frameH: FRAME_H
  },
  {
    key: ASSETS.MACK_DEATH,
    path: 'assets/img/samuraiMack/Death.png',
    frameW: FRAME_W,
    frameH: FRAME_H
  }
]

// ── Factory ──────────────────────────────────────────────────────────────────
/**
 * Create a SamuraiMack fighter and add it to the scene.
 * @param {Phaser.Scene} scene
 * @returns {Fighter}
 */
export function createSamuraiMack(scene) {
  return new Fighter(scene, {
    x: 200,
    y: GROUND_Y,
    texturePrefix: 'mack',
    facingRight: true,
    scale: FIGHTER_SCALE,
    // Hitbox: attack box extending to the right
    hitboxOffset: { x: 100, y: -120, w: 160, h: 50 },
    // Hurtbox: fighter body
    hurtboxSize: { w: 50, h: 120 }
  })
}
