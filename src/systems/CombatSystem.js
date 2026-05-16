/**
 * CombatSystem
 *
 * Responsible for checking hitbox overlaps and applying damage.
 * Isolated from Fighter so combat rules can be changed without
 * touching character code (e.g., add parry, combo multiplier, etc.)
 */

import { HIT_DAMAGE, P1_ATTACK_FRAME, P2_ATTACK_FRAME } from '../constants/GameConstants.js'

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
   * Returns { p1Hit, p2Hit }
   */
  static update(fighter1, fighter2) {
    const p1Hit = CombatSystem.checkHit(fighter1, fighter2, P1_ATTACK_FRAME)
    const p2Hit = CombatSystem.checkHit(fighter2, fighter1, P2_ATTACK_FRAME)
    return { p1Hit, p2Hit }
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
