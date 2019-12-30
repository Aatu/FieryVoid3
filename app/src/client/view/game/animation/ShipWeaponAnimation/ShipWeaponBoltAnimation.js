import * as THREE from "three";
import Vector from "../../../../../model/utils/Vector";
import ShipWeaponAnimation from "./ShipWeaponAnimation";
import BoltEffect from "../effect/BoltEffect";
import ExplosionEffect from "../effect/ExplosionEffect";

class ShipWeaponBoltAnimation extends ShipWeaponAnimation {
  constructor(
    time,
    combatLogEntry,
    fireOrder,
    weapon,
    shooterIcon,
    targetIcon,
    getPosition,
    getRandom,
    particleEmitterContainer,
    args,
    weaponAnimationService
  ) {
    super(getRandom);

    console.log(combatLogEntry);
    const hit = Boolean(combatLogEntry.shotsHit);

    this.particleEmitterContainer = particleEmitterContainer;
    console.log("hi?", particleEmitterContainer);

    let startTime = time + getRandom() * 2000;
    const speed = args.speed || 1;

    const startPosition = getPosition(shooterIcon, startTime).position.add(
      this.getLocationForSystem(weapon, shooterIcon)
    );
    startPosition.z += shooterIcon.shipZ;

    const endPosition = getPosition(targetIcon, startTime).position.add(
      this.getRandomPosition(20)
    );
    endPosition.z += targetIcon.shipZ;

    const distance = startPosition.distanceTo(endPosition);
    this.duration = distance / speed;
    let fade = 0;

    if (!hit) {
      const extra = getRandom() * 300 + 300;
      this.duration += extra;
      fade = extra * 0.8;
    }

    this.animations = [];

    this.animations.push(
      weaponAnimationService.getBoltEffect(
        startTime,
        startPosition,
        endPosition.clone(),
        speed,
        fade,
        this.duration,
        args,
        this
      )
    );

    this.explosion = null;

    if (!combatLogEntry.causedDamage()) {
      return;
    }

    if (hit) {
      weaponAnimationService.getDamageExplosion(
        args.explosionSize,
        endPosition,
        startTime + this.duration,
        this
      );

      this.duration += 1000;
    }
  }

  getDuration() {
    console.log("get duration", this.duration);
    return this.duration;
  }

  deactivate() {
    this.particleEmitterContainer.release(this);
  }
}

export default ShipWeaponBoltAnimation;
