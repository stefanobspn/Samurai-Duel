// ─── Game-wide constants ─────────────────────────────────────────────────────
// Single source of truth for all magic numbers.
// Change values here to affect the entire game.

export const CANVAS_WIDTH  = 1024
export const CANVAS_HEIGHT = 576

// Physics
export const GRAVITY      = 1800   // px/s² (arcade)
export const MOVE_SPEED   = 280    // px/s horizontal
export const JUMP_VELOCITY = -700  // px/s (negative = upward)

// Ground position — fighters land here (visual floor in background is at y=480)
export const GROUND_Y = 675

// Game timer
export const GAME_DURATION = 60   // seconds

// Sprite rendering
export const FIGHTER_SCALE = 2.5
export const FRAME_RATE    = 12   // default animation fps

// Combat
export const HIT_DAMAGE       = 10   // HP per successful hit
export const INITIAL_HEALTH   = 100

// Hitbox attack window — the frame index at which the hit registers
export const P1_ATTACK_FRAME  = 4
export const P2_ATTACK_FRAME  = 2

// Blocking window — how many frames before/after the attack frame can trigger a block
export const BLOCK_WINDOW     = 2

// Debugging
export const DEBUG_HITBOXES   = true

// Scene keys (avoid typos)
export const SCENES = {
  BOOT:     'BootScene',
  MENU:     'MenuScene',
  GAME:     'GameScene',
  GAMEOVER: 'GameOverScene',
}

// Asset keys
export const ASSETS = {
  BACKGROUND:    'background',
  SHOP:          'shop',

  // SamuraiMack
  MACK_IDLE:     'mack_idle',
  MACK_RUN:      'mack_run',
  MACK_JUMP:     'mack_jump',
  MACK_FALL:     'mack_fall',
  MACK_ATTACK1:  'mack_attack1',
  MACK_TAKEHIT:  'mack_takehit',
  MACK_DEATH:    'mack_death',

  // Kenji
  KENJI_IDLE:    'kenji_idle',
  KENJI_RUN:     'kenji_run',
  KENJI_JUMP:    'kenji_jump',
  KENJI_FALL:    'kenji_fall',
  KENJI_ATTACK1: 'kenji_attack1',
  KENJI_TAKEHIT: 'kenji_takehit',
  KENJI_DEATH:   'kenji_death',

  // Audio
  MUSIC:         'music',
  SWING_SFX:     'swing_sfx',
  HIT_SFX:       'hit_sfx',
  BLOCK1_SFX:    'block1_sfx',
  BLOCK2_SFX:    'block2_sfx',
}

// Fighter state enum — values MUST match asset key suffixes (e.g. 'mack_attack1')
export const FIGHTER_STATE = {
  IDLE:     'idle',
  RUN:      'run',
  JUMP:     'jump',
  FALL:     'fall',
  ATTACK:   'attack1',   // matches ASSETS.MACK_ATTACK1 = 'mack_attack1'
  TAKEHIT:  'takehit',   // matches ASSETS.MACK_TAKEHIT  = 'mack_takehit'
  DEATH:    'death',
}
