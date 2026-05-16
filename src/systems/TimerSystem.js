/**
 * TimerSystem
 *
 * Wraps Phaser's time.addEvent for a countdown timer.
 * Fires onTick(remaining) every second and onComplete() when done.
 */

export class TimerSystem {
  /**
   * @param {Phaser.Scene} scene
   * @param {number}       duration    — total seconds
   * @param {function}     onTick      — called with (remaining) each second
   * @param {function}     onComplete  — called when timer hits 0
   */
  constructor(scene, duration, onTick, onComplete) {
    this._remaining  = duration
    this._onTick     = onTick
    this._onComplete = onComplete
    this._stopped    = false

    // Fire immediately so the display shows the initial value
    this._onTick(this._remaining)

    this._event = scene.time.addEvent({
      delay:    1000,
      repeat:   duration - 1,
      callback: this._tick,
      callbackScope: this,
    })
  }

  _tick() {
    if (this._stopped) return
    this._remaining--
    this._onTick(this._remaining)
    if (this._remaining <= 0) {
      this._stopped = true
      this._onComplete()
    }
  }

  stop() {
    this._stopped = true
    if (this._event) this._event.remove(false)
  }

  get remaining() { return this._remaining }
}
