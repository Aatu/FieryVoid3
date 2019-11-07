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
    args
  ) {
    super(getRandom);

    const hit = fireOrder.result.getHitResolution();

    this.particleEmitterContainer = particleEmitterContainer;

    let startTime = getRandom() * 2000;
    const speed = args.speed || 1;

    const startPosition = replayShipMovement.getPositionAtTime(shooterIcon, 0);
    startPosition.z = shooterIcon.shipZ;
    const endPosition = replayShipMovement
      .getPositionAtTime(targetIcon, 0)
      .add(this.getRandomPosition(hit ? 100 : 200));
    endPosition.z += targetIcon.shipZ;

    const distance = startPosition.distanceTo(endPosition);
    let duration = distance / speed;
    let fade = 0;

    if (!hit) {
      const extra = getRandom() * 300 + 300;
      duration += extra;
      fade = extra * 0.8;
    }

    console.log("ShipWeaponBoltAnimation", fireOrder.result);

    this.bolt = new BoltEffect(
      startTime,
      startPosition,
      endPosition.clone(),
      speed,
      fade,
      duration,
      args,
      getRandom,
      particleEmitterContainer
    );

    if (hit) {
      this.explosion = new ExplosionEffect(
        particleEmitterContainer,
        getRandom,
        {
          position: endPosition.clone(),
          time: startTime + duration,
          duration: 250 + getRandom() * 250,
          type: "glow"
        }
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
