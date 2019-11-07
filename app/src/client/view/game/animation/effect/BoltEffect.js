import * as THREE from "three";
import Vector from "../../../../../model/utils/Vector";
import Animation from "../Animation";

class BoltEffect extends Animation {
  constructor(
    startTime,
    startPosition,
    endPosition,
    speed,
    fade,
    duration,
    args,
    getRandom,
    particleEmitterContainer
  ) {
    super(getRandom);
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
      particleEmitterContainer
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
    particleEmitterContainer
  ) {
    /*
    particleEmitterContainer
      .getParticle(this)
      .setActivationTime(0)
      .setSize(args.size * 0.3)
      .setOpacity(0.5)
      .setPosition(startPosition)
      .setVelocity(velocity)
      .setColor(new THREE.Color(1, 1, 0.8))
      .setActivationTime(startTime, 0)
      .setFadeIn(startTime, 0)
      .setFadeOut(startTime + duration, 0);
      */

    const directionNormal = endPosition.sub(startPosition).normalize();
    const color = args.color
      ? new THREE.Color(args.color[0], args.color[1], args.color[2])
      : new THREE.Color(1, 0, 0);

    const tailLength = args.length ? args.length : args.size * 2;

    particleEmitterContainer
      .getBoltParticle(this)
      //.setActivationTime(0)
      .setScale(tailLength, args.size)
      .setOpacity(0.5)
      .setPosition(startPosition)
      .setBoltTexture()
      .setRotation(directionNormal)
      //.setVelocity(velocity)
      .setColor(color)
      .setVelocity(velocity)
      .setActivationTime(startTime)
      .setDeactivationTime(startTime + duration, fade);

    const coreLength = (args.length ? args.length : args.size * 2) * 0.5;

    const corePosition = coreLength * 0.2;
    const coreTime = corePosition / speed;

    particleEmitterContainer
      .getBoltParticle(this)
      //.setActivationTime(0)
      .setScale(coreLength, args.size * 0.5)
      .setOpacity(0.5)
      .setPosition(startPosition)
      .setBoltTexture()
      .setRotation(directionNormal)
      //.setVelocity(velocity)
      .setColor(new THREE.Color(1, 1, 1))
      .setVelocity(velocity)
      .setActivationTime(startTime + coreTime)
      .setDeactivationTime(startTime + coreTime + duration, fade);

    return duration + coreTime;
  }

  deactivate() {
    this.particleEmitterContainer.release(this);
  }
}

export default BoltEffect;
