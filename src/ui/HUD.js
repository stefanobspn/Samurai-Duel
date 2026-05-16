/**
 * HUD
 *
 * Manages the DOM overlay: health bars and timer display.
 * Using DOM (not Phaser objects) keeps it crisp at any resolution
 * and lets us use CSS animations/transitions.
 */

export class HUD {
  constructor() {
    this._p1Fill   = document.getElementById('p1-fill')
    this._p2Fill   = document.getElementById('p2-fill')
    this._timerEl  = document.getElementById('timer')
  }

  /**
   * @param {number} pct  — 0..100
   */
  setPlayer1Health(pct) {
    this._p1Fill.style.width = Math.max(0, pct) + '%'
  }

  /**
   * @param {number} pct  — 0..100
   */
  setPlayer2Health(pct) {
    this._p2Fill.style.width = Math.max(0, pct) + '%'
  }

  /**
   * @param {number} seconds
   */
  setTimer(seconds) {
    this._timerEl.textContent = seconds

    if (seconds <= 10) {
      this._timerEl.classList.add('urgent')
    } else {
      this._timerEl.classList.remove('urgent')
    }
  }

  show() {
    document.getElementById('hud').style.display = 'flex'
  }

  hide() {
    document.getElementById('hud').style.display = 'none'
  }
}
