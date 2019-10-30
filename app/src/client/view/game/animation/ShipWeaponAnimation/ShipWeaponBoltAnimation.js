import * as THREE from "three";
import Vector from "../../../../../model/utils/Vector";
import ShipWeaponAnimation from "./ShipWeaponAnimation";

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

    console.log("args", args);

    let startTime = getRandom() * 2000;
    const speed = args.speed || 1;
    console.log("speed is", speed);

    const startPosition = replayShipMovement.getPositionAtTime(shooterIcon, 0);
    startPosition.z = shooterIcon.shipZ;
    const endPosition = replayShipMovement
      .getPositionAtTime(targetIcon, 0)
      .add(this.getRandomPosition(100));
    endPosition.z += targetIcon.shipZ;

    const distance = startPosition.distanceTo(endPosition);
    this.duration = distance / speed;

    const velocity = new Vector(endPosition)
      .sub(startPosition)
      .normalize()
      .multiplyScalar(speed);

    console.log("ShipWeaponBoltAnimation", fireOrder);

    let shots = args.shots || 1;

    while (shots--) {
      this.createBolt(
        startTime,
        startPosition,
        this.duration,
        velocity,
        speed,
        args,
        particleEmitterContainer
      );

      startTime += 50;
    }
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

  getDuration() {
    return this.duration;
  }
}

export default ShipWeaponBoltAnimation;
