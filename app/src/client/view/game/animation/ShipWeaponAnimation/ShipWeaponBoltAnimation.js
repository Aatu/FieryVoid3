import * as THREE from "three";
import Animation from "../Animation";
import Vector from "../../../../../model/utils/Vector";
import { getSeededRandomGenerator } from "../../../../../model/utils/math";

class ShipWeaponBoltAnimation extends Animation {
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
    super();

    console.log("args", args);

    const startTime = getRandom() * 2000;
    const speed = args.speed || 1;
    console.log("speed is", speed);
    const startPosition = replayShipMovement.getPositionAtTime(shooterIcon, 0);
    const endPosition = replayShipMovement.getPositionAtTime(targetIcon, 0);
    const distance = startPosition.distanceTo(endPosition);
    const duration = distance / speed;

    const velocity = new Vector(endPosition)
      .sub(startPosition)
      .normalize()
      .multiplyScalar(speed);

    console.log("ShipWeaponBoltAnimation", fireOrder);

    this.createBolt(
      startTime,
      startPosition,
      duration,
      velocity,
      speed,
      args,
      particleEmitterContainer
    );
  }

  createBolt(
    startTime,
    startPosition,
    duration,
    velocity,
    speed,
    args,
    particleEmitterContainer
  ) {
    for (
      let i = 0, size = args.size, opacity = 1, time = startTime;
      i < 5;
      i++
    ) {
      size *= 0.8;
      opacity *= 0.8;
      time += (size * 0.3) / speed;
      particleEmitterContainer
        .getParticle(this)
        .setActivationTime(0)
        .setSize(size)
        .setOpacity(0.3 * opacity)
        .setPosition(startPosition)
        .setVelocity(velocity)
        .setColor(new THREE.Color(args.color[0], args.color[1], args.color[2]))
        .setActivationTime(time, 0)
        .setFadeIn(time, 0)
        .setFadeOut(time + duration, 0);
    }

    particleEmitterContainer
      .getParticle(this)
      .setActivationTime(0)
      .setSize(args.size * 0.2)
      .setOpacity(0.7)
      .setPosition(startPosition)
      .setVelocity(velocity)
      .setColor(new THREE.Color(1, 1, 0.8))
      .setActivationTime(startTime + (args.size * 0.26) / speed, 0)
      .setFadeIn(startTime, 0)
      .setFadeOut(startTime + duration, 0);

    particleEmitterContainer
      .getParticle(this)
      .setActivationTime(0)
      .setSize(args.size * 0.5)
      .setOpacity(0.5)
      .setPosition(startPosition)
      .setVelocity(velocity)
      .setColor(new THREE.Color(1, 1, 0.8))
      .setActivationTime(startTime + (args.size * 0.3) / speed, 0)
      .setFadeIn(startTime, 0)
      .setFadeOut(startTime + duration, 0);
  }
}

export default ShipWeaponBoltAnimation;
