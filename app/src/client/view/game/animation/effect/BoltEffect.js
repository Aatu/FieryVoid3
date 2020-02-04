import * as THREE from "three";
import Vector from "../../../../../model/utils/Vector";

class BoltEffect {
  create(
    startTime,
    startPosition,
    endPosition,
    speed,
    fade,
    duration,
    args,
    getRandom,
    particleEmitterContainer,
    context
  ) {
    this.particleEmitterContainer = particleEmitterContainer;

    const velocity = new Vector(endPosition)
      .sub(startPosition)
      .normalize()
      .multiplyScalar(speed);

    this.duration = this.createBolt(
      startTime,
      startPosition,
      endPosition,
      duration,
      velocity,
      speed,
      fade,
      args,
      particleEmitterContainer,
      getRandom,
      context
    );
  }

  createBolt(
    startTime,
    startPosition,
    endPosition,
    duration,
    velocity,
    speed,
    fade,
    args,
    particleEmitterContainer,
    getRandom,
    context
  ) {
    const directionNormal = endPosition.sub(startPosition).normalize();
    const color = args.color
      ? new THREE.Color(args.color[0], args.color[1], args.color[2])
      : new THREE.Color(1, 0, 0);

    const tailLength = args.length ? args.length : args.size * 2;

    particleEmitterContainer
      .getBoltParticle(context)
      .setScale(tailLength, args.size)
      .setOpacity(0.5)
      .setPosition(startPosition)
      .setBoltTexture()
      .setRotation(directionNormal)
      .setColor(color)
      .setVelocity(velocity)
      .setActivationTime(startTime)
      .setDeactivationTime(startTime + duration, fade);

    const coreLength = (args.length ? args.length : args.size * 2) * 0.5;

    const corePosition = coreLength * 0.2;
    const coreTime = corePosition / speed;

    const coreOpacity = args.coreOpacity || 0.5;

    particleEmitterContainer
      .getBoltParticle(context)
      //.setActivationTime(0)
      .setScale(coreLength, args.size * 0.5)
      .setOpacity(coreOpacity)
      .setPosition(startPosition)
      .setBoltTexture()
      .setRotation(directionNormal)
      //.setVelocity(velocity)
      .setColor(new THREE.Color(1, 1, 1))
      .setVelocity(velocity)
      .setActivationTime(startTime + coreTime)
      .setDeactivationTime(startTime + duration + coreTime, fade);

    return duration + coreTime;
  }
}

export default BoltEffect;
