import * as THREE from "three";
import Vector from "../../../../../model/utils/Vector";
import ShipWeaponAnimation from "./ShipWeaponAnimation";
import BoltEffect from "../effect/BoltEffect";
import ExplosionEffect from "../effect/ExplosionEffect";

class ShipWeaponBoltAnimation extends ShipWeaponAnimation {
  constructor(
    fireOrder,
    weapon,
    shooterIcon,
    targetIcon,
    replayShipMovement,
    getRandom,
    particleEmitterContainer,
    args,
    weaponAnimationService
  ) {
    super(getRandom);

    const hit = fireOrder.result.getHitResolution().result;
    const damage = fireOrder.result.getDamageResolution();

    this.particleEmitterContainer = particleEmitterContainer;

    let startTime = getRandom() * 2000;
    const speed = args.speed || 1;

    const startPosition = replayShipMovement
      .getPositionAtTime(shooterIcon, 0)
      .add(this.getLocationForSystem(weapon, shooterIcon));
    startPosition.z += shooterIcon.shipZ;

    const endPosition = replayShipMovement
      .getPositionAtTime(targetIcon, 0)
      .add(this.getRandomPosition(20));
    endPosition.z += targetIcon.shipZ;

    const distance = startPosition.distanceTo(endPosition);
    let duration = distance / speed;
    let fade = 0;

    if (!hit) {
      const extra = getRandom() * 300 + 300;
      duration += extra;
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
        duration,
        args,
        this
      )
    );

    this.explosion = null;

    if (!damage) {
      return;
    }
    if (hit) {
      weaponAnimationService.getDamageExplosion(
        damage.shots[0],
        endPosition,
        startTime + duration,
        this
      );
    }
  }

  getDuration() {
    return this.duration;
  }

  deactivate() {
    this.particleEmitterContainer.release(this);
  }
}

export default ShipWeaponBoltAnimation;
