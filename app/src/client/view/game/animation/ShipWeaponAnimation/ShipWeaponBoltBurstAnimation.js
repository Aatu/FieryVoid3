import * as THREE from "three";
import Vector from "../../../../../model/utils/Vector";
import ShipWeaponAnimation from "./ShipWeaponAnimation";
import BoltEffect from "../effect/BoltEffect";
import ExplosionEffect from "../effect/ExplosionEffect";

class ShipWeaponBoltBurstAnimation extends ShipWeaponAnimation {
  constructor(
    fireOrder,
    weapon,
    shooterIcon,
    targetIcon,
    replayShipMovement,
    getRandom,
    particleEmitterContainer,
    args
  ) {
    super(getRandom);
    this.animations = [];
    this.particleEmitterContainer = particleEmitterContainer;

    const hit = fireOrder.result.getHitResolution().result;
    const damage = fireOrder.result.getDamageResolution();
    const missesFirst = this.getRandom() > 0.5;
    const speed = args.speed || 1;
    let startTime = getRandom() * 2000;

    const startPosition = replayShipMovement.getPositionAtTime(shooterIcon, 0);
    startPosition.z = shooterIcon.shipZ;

    let endPosition = replayShipMovement
      .getPositionAtTime(targetIcon, 0)
      .add(this.getRandomPosition(hit ? 20 : 40));
    endPosition.z += targetIcon.shipZ;

    const distance = startPosition.distanceTo(endPosition);
    let duration = distance / speed;

    let offsetVector = this.getRandomPosition(5);

    const missExtra = getRandom() * 300 + 300;
    const missFade = missExtra * 0.8;
    let hitIndex = 0;

    for (let shotNumber = 1; shotNumber <= damage.totalShots; shotNumber++) {
      const startExtra = (10 / speed) * shotNumber + startTime;

      if (
        (missesFirst && shotNumber <= damage.totalShots - damage.shotsHit) ||
        (!missesFirst && shotNumber > damage.shotsHit)
      ) {
        this.animations.push(
          new BoltEffect(
            startExtra,
            startPosition,
            endPosition.clone(),
            speed,
            missFade,
            duration + missExtra,
            args,
            getRandom,
            particleEmitterContainer
          )
        );
      } else {
        this.animations.push(
          new BoltEffect(
            startExtra,
            startPosition,
            endPosition.clone(),
            speed,
            0,
            duration,
            args,
            getRandom,
            particleEmitterContainer
          )
        );

        this.createDamageExplosion(
          damage.shots[hitIndex],
          endPosition,
          startExtra + duration
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
    this.animations.forEach(animation => animation.deactivate());
  }
}

export default ShipWeaponBoltBurstAnimation;
