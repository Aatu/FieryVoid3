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

    const missesFirst = this.getRandom() > 0.5;
    const speed = args.speed || 1;

    this.extraWait = getRandom() * 2000;
    let startTime = time + this.extraWait;

    const startPosition = getPosition(shooterIcon, startTime).position.add(
      this.getLocationForSystem(
        weapon,
        shooterIcon,
        getPosition(shooterIcon, startTime).facing
      )
    );
    startPosition.z += shooterIcon.shipZ;

    let endPosition = getPosition(targetIcon, startTime).position.add(
      this.getRandomPosition(20)
    );
    endPosition.z += targetIcon.shipZ;

    const distance = startPosition.distanceTo(endPosition);
    this.duration = distance / speed;

    let offsetVector = this.getRandomPosition(5);

    const missExtra = getRandom() * 300 + 300;
    const missFade = missExtra * 0.8;

    const totalShots = combatLogEntry.totalShots;
    const shotsHit = combatLogEntry.shotsHit;

    this.startExtra = 0;
    for (let shotNumber = 1; shotNumber <= totalShots; shotNumber++) {
      this.startExtra = (30 / speed) * shotNumber;

      if (
        (missesFirst && shotNumber <= totalShots - shotsHit) ||
        (!missesFirst && shotNumber > shotsHit)
      ) {
        this.animations.push(
          weaponAnimationService.getBoltEffect(
            this.startExtra + startTime,
            startPosition,
            endPosition.clone(),
            speed,
            missFade,
            this.duration + missExtra,
            args,
            this
          )
        );
      } else {
        this.animations.push(
          weaponAnimationService.getBoltEffect(
            this.startExtra + startTime,
            startPosition,
            endPosition.clone(),
            speed,
            0,
            this.duration,
            args,
            this
          )
        );

        weaponAnimationService.getDamageExplosion(
          args.explosionSize,
          endPosition,
          this.startExtra + startTime + this.duration,
          this
        );
      }

      endPosition = endPosition.add(offsetVector);
    }
  }

  getDuration() {
    return this.duration + this.extraWait + this.startExtra + 1000;
  }

  deactivate() {
    this.particleEmitterContainer.release(this);
  }
}

export default ShipWeaponBoltBurstAnimation;
