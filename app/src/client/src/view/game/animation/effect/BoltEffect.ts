import Vector, { IVector } from "@fieryvoid3/model/src/utils/Vector";
import * as THREE from "three";
import { ParticleEmitterContainer } from "../particle";
import { IDuration } from "../Animation";
type BoltArgs = {
  size?: number;
  color?: [number, number, number];
  length?: number;
  repeat?: number;
  coreOpacity?: number;
};

class BoltEffect implements IDuration {
  public duration: number = 0;

  create(
    startTime: number,
    startPosition: IVector,
    endPosition: IVector,
    speed: number,
    fade: number,
    duration: number,
    args: BoltArgs,
    getRandom: () => number,
    particleEmitterContainer: ParticleEmitterContainer,
    context: unknown
  ) {
    this.duration = duration;

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
    startTime: number,
    startPosition: IVector,
    endPosition: IVector,
    duration: number,
    velocity: IVector,
    speed: number,
    fade: number,
    args: BoltArgs,
    particleEmitterContainer: ParticleEmitterContainer,
    getRandom: () => number,
    context: unknown
  ) {
    const size = args.size || 10;
    const directionNormal = Vector.toVector(endPosition)
      .sub(startPosition)
      .normalize();
    const color = args.color
      ? new THREE.Color(args.color[0], args.color[1], args.color[2])
      : new THREE.Color(1, 0, 0);

    const tailLength = args.length ? args.length : size * 2;

    const repeat = args.repeat || 0;

    particleEmitterContainer
      .getBoltParticle(context)
      .setScale(tailLength, size)
      .setOpacity(0.5)
      .setPosition(startPosition)
      .setBoltTexture()
      .setRotation(directionNormal)
      .setColor(color)
      .setVelocity(velocity)
      .setActivationTime(startTime)
      .setDeactivationTime(startTime + duration, fade)
      .setRepeat(repeat);

    const coreLength = (args.length ? args.length : size * 2) * 0.5;

    const corePosition = coreLength * 0.2;
    const coreTime = corePosition / speed;

    const coreOpacity = args.coreOpacity || 0.5;

    particleEmitterContainer
      .getBoltParticle(context)
      //.setActivationTime(0)
      .setScale(coreLength, size * 0.5)
      .setOpacity(coreOpacity)
      .setPosition(startPosition)
      .setBoltTexture()
      .setRotation(directionNormal)
      //.setVelocity(velocity)
      .setColor(new THREE.Color(1, 1, 1))
      .setVelocity(velocity)
      .setActivationTime(startTime + coreTime)
      .setDeactivationTime(startTime + duration + coreTime, fade)
      .setRepeat(repeat);

    return duration + coreTime;
  }
}

export default BoltEffect;
