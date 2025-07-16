import { BaseFighter } from "./Fighter.js"
import { playRandomPunchSound } from "./Fighter.js"
import { frameTime } from "./Main.js"

export class Shooter extends BaseFighter {
  constructor(context, x, y, opponent, idle, hurt, magic, hurtb, addMagic) {
    super(context, x, y, addMagic)
    // init vars
    this.animationTimer = performance.now()
    this.slide = 0
    this.slideDone = true
    this.velocityY = 0
    this.lost = false

    this.hp             = 2
    this.addMagic       = addMagic
    this.currentDirection = this.leftDirection
    this.idleSprite     = idle
    this.hurtSprite     = hurt
    this.magicSprite    = magic
    this.hurtBox        = hurtb
    this.opponent       = opponent

    this.magicDelay     = 1.7
    this.firedMagic     = false
    this.idleTime       = 2.8

    this.states = {
      idle:     [[this.idleSprite], this.idleInit,     this.idleUpdate],
      magic:    [[this.magicSprite], this.magicInit,    this.magicUpdate],
      hurtStand:[[this.hurtSprite], this.hurtStandInit, this.hurtStandUpdate],
      hurtFall: [[this.hurtSprite], this.hurtFallInit,  this.hurtFallUpdate]
    }

    this.changeState(this.states.idle)
  }

  changeState(newState) {
    if (this.currentState === newState) return
    this.currentState   = newState
    this.currentFrame   = 0
    this.animationTimer = performance.now()
    this.currentState[1]()
  }

  // --- state inits & updates ---
  idleInit = () => {
    this.angle     = 0
    this.velocityX = 0
    this.hitStruck = false
  }
  idleUpdate = () => {
    this.idleTime -= frameTime.secondsPassed
    if (this.idleTime <= 0) {
      this.idleTime = 2.8
      this.changeState(this.states.magic)
    }
  }

  magicInit = () => {
    // fire projectile
    this.addMagic(
      -this.currentDirection,
      this.positionX - 100 * -this.currentDirection,
      this.positionY - this.magicSprite.adjusts[1] * 1.1,
      this.opponent
    )
    this.firedMagic = true
    this.magicTimer = performance.now()
    if (!this.notOnGround()) this.velocityX = 0
  }
  magicUpdate = () => {
    if (performance.now() > this.magicTimer + 220) {
      this.changeState(this.states.idle)
    }
  }

  hurtStandInit = () => {
    this.angle     = 0
    this.hurtTimer = performance.now()
  }
  hurtStandUpdate = () => {
    if (this.lost) {
      this.changeState(this.states.hurtFall)
    }
    if (performance.now() > this.hurtTimer + 260) {
      this.hurtTimer = performance.now()
      this.slide     = 0
      this.changeState(this.states.idle)
    }
  }

  hurtFallInit = () => {
    this.fallDuration   = ((Math.random() * 0.7) + 1) * 1000 | 0
    this.groundPosition = 610
    this.hurtTimer      = performance.now()
    this.velocityY      = -700
    this.randomDirection= Math.random() < 0.5 ? Math.PI/2 : -Math.PI/2
  }
  hurtFallUpdate = () => {
    if (this.randomDirection < 0) {
      if (this.angle > this.randomDirection) this.angle -= 0.1
    } else {
      if (this.angle < this.randomDirection) this.angle += 0.1
    }
    if (performance.now() > this.hurtTimer + this.fallDuration) {
      this.destroy()
    }
  }

  // --- shared updates & draw ---
  update(frameTime) {
    if (!this.context) return
    if (this.positionX < -this.hurtBox[2]) return this.destroy()

    // HP & lost state
    if (this.hp <= 0) {
      this.lost = true
      this.changeState(this.states.hurtFall)
    } else {
      this.lost = false
    }

    // magic rate limiter
    if (this.firedMagic) {
      if (performance.now() > this.magicTimer + this.magicDelay * 1000) {
        this.firedMagic = false
      }
    }

    // position
    if (this.opponent.shouldOffset && this.opponent.velocityX > 0) {
      this.positionX += ((this.velocityX - 300)|0) * frameTime.secondsPassed
    } else {
      this.positionX += (this.velocityX|0) * frameTime.secondsPassed
    }
    this.positionY += (this.velocityY|0) * frameTime.secondsPassed

    // gravity & ground clamp
    if (this.notOnGround()) {
      this.velocityY += 3000 * frameTime.secondsPassed
    }
    if (this.positionY > this.groundPosition) {
      this.positionY = this.groundPosition
      this.velocityY = 0
    }

    this.updateSlide(frameTime)
    this.updateAnimation(frameTime)
    this.currentState[2]()
  }

  updateSlide(frameTime) {
    if (Math.abs(this.slide) > 3200) {
      this.slide /= 1.2
      this.velocityX = this.slide * frameTime.secondsPassed
    } else if (!this.slideDone) {
      this.slideDone = true
      this.slide     = 0
      this.velocityX = 0
    }
  }

  updateAnimation(frameTime) {
    if (frameTime.previous > this.animationTimer + 100) {
      this.animationTimer = frameTime.previous
      this.currentFrame++
      if (this.currentFrame >= this.currentState[0].length) {
        this.currentFrame = 0
      }
    }
  }

  draw() {
    if (!this.context) return
    const sprite = this.currentState[0][this.currentFrame]
    const w = sprite.adjusts[0], h = sprite.adjusts[1]
    const ox = sprite.adjusts[2], oy = h/2

    this.context.save()
    this.context.translate(this.positionX, this.positionY - oy)
    this.context.rotate(this.angle)
    this.context.scale(this.currentDirection, 1)
    this.context.drawImage(sprite.img, -ox, -oy, w, h)
    this.context.restore()
  }

  destroy() {
    this.context = null
    this.currentState = null
    this.opponent    = null
    this.hurtBox     = null
    this.addMagic    = null
    this.states      = null
  }
}

export class Giant extends BaseFighter {
  constructor(context, x, y, opponent, idle, kick, hurt, walk1, walk2, walk3, walk4, hurtb) {
    super(context, x, y)
    // init vars
    this.animationTimer = performance.now()
    this.slide = 0
    this.slideDone = true
    this.velocityY = 0
    this.lost = false

    this.hp               = 9
    this.isGiant          = true
    this.currentDirection = this.leftDirection
    this.idleSprite       = idle
    this.kickSprite       = kick
    this.hurtSprite       = hurt
    this.walk1Sprite      = walk1
    this.walk2Sprite      = walk2
    this.walk3Sprite      = walk3
    if (walk4) this.walk4Sprite = walk4

    this.opponent   = opponent
    this.hurtBox    = hurtb.map(v => Math.round(v * 1.6))

    this.states = {
      idle:     [[this.idleSprite], this.idleInit,     this.idleUpdate],
      kick:     [[this.walk3Sprite, this.kickSprite, this.idleSprite], this.kickInit, this.kickUpdate],
      walk:     walk4
                  ? [[this.walk1Sprite, this.walk2Sprite, this.walk3Sprite, this.walk4Sprite], this.walkInit, this.walkUpdate]
                  : [[this.walk1Sprite, this.walk2Sprite, this.walk3Sprite], this.walkInit, this.walkUpdate],
      hurtStand:[[this.hurtSprite], this.hurtStandInit, this.hurtStandUpdate],
      hurtFall: [[this.hurtSprite], this.hurtFallInit,  this.hurtFallUpdate]
    }

    this.changeState(this.states.walk)
  }

  changeState(newState) {
    if (this.currentState === newState) return
    this.currentState   = newState
    this.currentFrame   = 0
    this.animationTimer = performance.now()
    this.currentState[1]()
  }

  idleInit = () => {
    this.angle     = 0
    this.velocityX = 0
    this.hitStruck = false
  }
  idleUpdate = () => {
    if (Math.random() * 500 < 2) this.changeState(this.states.kick)
  }

  walkInit = () => {
    this.velocityX = -40
  }
  walkUpdate = () => {
    if (this.opponent.lost) return
    if (Math.abs(this.positionX - this.opponent.positionX)
        < (this.currentState[0][this.currentFrame].adjusts[0]/1.4)*2
          + (this.opponent.hurtBox[2]/1.4)
    ) {
      this.changeState(this.states.idle)
    }
  }

  kickInit = () => {
    this.velocityX = 50
    this.hitStruck = false
  }
  kickUpdate = () => {
    if (this.currentFrame === 1) this.velocityX = 0
    if (this.currentFrame === 2) this.changeState(this.states.walk)
    this.updateAttackCollided()
  }

  updateAttackCollided() {
    if (this.hitStruck || !this.context || this.currentState !== this.states.kick) return
    if (this.currentFrame !== 1) return

    if (this.positionX <= this.opponent.positionX) return
    const reach = this.kickSprite.adjusts[1] + this.opponent.hurtBox[2]/2
    if (this.positionX - this.opponent.positionX > reach) return

    const topY = this.positionY - this.currentState[0][this.currentFrame].adjusts[3]*2
    if (topY > this.opponent.positionY || this.positionY < this.opponent.positionY - this.opponent.hurtBox[3]) return

    playRandomPunchSound()
    this.opponent.changeState(this.opponent.states.hurtFall)
    this.opponent.hp = Math.max(0, this.opponent.hp - 70)
    this.opponent.slideDone = false
    this.opponent.slide = -4300 * this.currentDirection
    this.hitStruck = true
  }

  update(frameTime) {
    if (!this.context) return
    if (this.positionX < -this.hurtBox[2]) return this.destroy()

    if (this.hp <= 0) {
      this.lost = true
      this.changeState(this.states.hurtFall)
    } else {
      this.lost = false
    }

    if (this.opponent.shouldOffset && this.opponent.velocityX > 0) {
      this.positionX += ((this.velocityX - 300)|0) * frameTime.secondsPassed
    } else {
      this.positionX += (this.velocityX|0) * frameTime.secondsPassed
    }
    this.positionY += (this.velocityY|0) * frameTime.secondsPassed

    if (this.notOnGround()) {
      this.velocityY += 4000 * frameTime.secondsPassed
    }
    if (this.positionY > this.groundPosition) {
      this.positionY = this.groundPosition
      this.velocityY = 0
    }

    this.updateSlide(frameTime)
    this.updateAnimation(frameTime)
    this.currentState[2]()
  }

  updateSlide(frameTime) {
    if (Math.abs(this.slide) > 3200) {
      this.slide /= 1.2
      this.velocityX = this.slide * frameTime.secondsPassed
    } else if (!this.slideDone) {
      this.slideDone = true
      this.slide     = 0
      this.velocityX = 0
    }
  }

  updateAnimation(frameTime) {
    if (frameTime.previous > this.animationTimer + 100) {
      this.animationTimer = frameTime.previous
      this.currentFrame++
      if (this.currentFrame >= this.currentState[0].length) {
        this.currentFrame = 0
      }
    }
  }

  draw() {
    if (!this.context) return
    const sprite = this.currentState[0][this.currentFrame]
    const w = sprite.adjusts[0] * 1.6
    const h = sprite.adjusts[1] * 1.6
    const ox = sprite.adjusts[2] * 1.6
    const oy = h / 2

    this.context.save()
    this.context.translate(this.positionX, this.positionY - oy)
    this.context.rotate(this.angle)
    this.context.scale(this.currentDirection, 1)
    this.context.drawImage(sprite.img, -ox, -oy, w, h)
    this.context.restore()
  }

  destroy() {
    this.context        = null
    this.currentState   = null
    this.opponent       = null
    this.hurtBox        = null
    this.idleSprite     = null
    this.walk1Sprite    = null
    this.walk2Sprite    = null
    this.walk3Sprite    = null
    this.walk4Sprite    = null
    this.kickSprite     = null
    this.hurtSprite     = null
    this.states         = null
  }
}
