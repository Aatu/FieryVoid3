import * as THREE from "three";
import Vector from "../../../../../model/utils/Vector";
import ShipWeaponAnimation from "./ShipWeaponAnimation";
import BoltEffect from "../effect/BoltEffect";
import ExplosionEffect from "../effect/ExplosionEffect";

class ShipWeaponBoltBurstAnimation extends ShipWeaponAnimation {
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
    this.animations = [];
    this.particleEmitterContainer = particleEmitterContainer;

    const hit = fireOrder.result.getHitResolution().result;
    const damage = fireOrder.result.getDamageResolution();
    const missesFirst = this.getRandom() > 0.5;
    const speed = args.speed || 1;
    let startTime = time + getRandom() * 2000;

    const startPosition = getPosition(shooterIcon, startTime).position.add(
      this.getLocationForSystem(weapon, shooterIcon)
    );
    startPosition.z += shooterIcon.shipZ;

    let endPosition = getPosition(targetIcon, startTime).position.add(
      this.getRandomPosition(20)
    );
    endPosition.z += targetIcon.shipZ;

    const distance = startPosition.distanceTo(endPosition);
    let duration = distance / speed;

    let offsetVector = this.getRandomPosition(5);

    const missExtra = getRandom() * 300 + 300;
    const missFade = missExtra * 0.8;
    let hitIndex = 0;

    if (!damage) {
      return;
    }

    const totalShots = damage.totalShots;
    const shotsHit = damage.shotsHit;

    for (let shotNumber = 1; shotNumber <= totalShots; shotNumber++) {
      const startExtra = (30 / speed) * shotNumber + startTime;

      if (
        (missesFirst && shotNumber <= totalShots - shotsHit) ||
        (!missesFirst && shotNumber > shotsHit)
      ) {
        this.animations.push(
          weaponAnimationService.getBoltEffect(
            startExtra,
            startPosition,
            endPosition.clone(),
            speed,
            missFade,
            duration + missExtra,
            args,
            this
          )
        );
      } else {
        this.animations.push(
          weaponAnimationService.getBoltEffect(
            startExtra,
            startPosition,
            endPosition.clone(),
            speed,
            0,
            duration,
            args,
            this
          )
        );

        weaponAnimationService.getDamageExplosion(
          damage.shots[hitIndex],
          endPosition,
          startExtra + duration,
          this
        );

        hitIndex++;
      }

      endPosition = endPosition.add(offsetVector);
    }
  }

  getDuration() {
    return this.duration;
  }

  deactivate() {
    this.particleEmitterContainer.release(this);
  }
}

export default ShipWeaponBoltBurstAnimation;
