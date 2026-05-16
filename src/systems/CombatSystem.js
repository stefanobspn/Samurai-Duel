/**
 * CombatSystem
 *
 * Responsible for checking hitbox overlaps and applying damage.
 * Isolated from Fighter so combat rules can be changed without
 * touching character code (e.g., add parry, combo multiplier, etc.)
 */

import { HIT_DAMAGE, P1_ATTACK_FRAME, P2_ATTACK_FRAME, BLOCK_WINDOW } from '../constants/GameConstants.js'

export class CombatSystem {
  /**
   * @param {Fighter} attacker
   * @param {Fighter} defender
   * @param {number}  attackFrame — the animation frame at which damage registers
   */
  static checkHit(attacker, defender, attackFrame) {
    if (!attacker.isAttacking) return false
    if (attacker.framesCurrent !== attackFrame) return false

    const aBox = attacker.getHitbox()
    const dBox = defender.getHurtbox()

    const hit = CombatSystem._rectsOverlap(aBox, dBox)

    if (hit) {
      defender.receiveHit(HIT_DAMAGE)
      attacker.isAttacking = false
    }

    // Miss — clear attacking flag when window passes
    if (attacker.isAttacking && attacker.framesCurrent === attackFrame) {
      attacker.isAttacking = false
    }

    return hit
  }

  /**
   * Run both collision checks in one call.
   * Returns { p1Hit, p2Hit, blocked }
   */
  static update(fighter1, fighter2) {
    // 1. Check for Block (Attack box clash)
    // We allow a "window" for blocking so it's easier to trigger
    const f1InWindow = fighter1.isAttacking && 
                       Math.abs(fighter1.framesCurrent - P1_ATTACK_FRAME) <= BLOCK_WINDOW
    const f2InWindow = fighter2.isAttacking && 
                       Math.abs(fighter2.framesCurrent - P2_ATTACK_FRAME) <= BLOCK_WINDOW

    if (f1InWindow && f2InWindow) {
      if (CombatSystem._rectsOverlap(fighter1.getHitbox(), fighter2.getHitbox())) {
        fighter1.isAttacking = false
        fighter2.isAttacking = false
        return { p1Hit: false, p2Hit: false, blocked: true }
      }
    }

    const p1Hit = CombatSystem.checkHit(fighter1, fighter2, P1_ATTACK_FRAME)
    const p2Hit = CombatSystem.checkHit(fighter2, fighter1, P2_ATTACK_FRAME)
    return { p1Hit, p2Hit, blocked: false }
  }

  /** AABB overlap check */
  static _rectsOverlap(a, b) {
    return (
      a.x < b.x + b.width  &&
      a.x + a.width  > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    )
  }
}
