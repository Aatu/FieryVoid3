import Vector from "@fieryvoid3/model/src/utils/Vector";
import BoltEffect, { BoltArgs } from "../../../animation/effect/BoltEffect";
import ExplosionEffect from "../../../animation/effect/ExplosionEffect";
import { ParticleEmitterContainer } from "../../../animation/particle";

const boltEffect = new BoltEffect();

class ShipWeaponAnimationService {
  private getRandom: () => number;
  private particleEmitterContainer: ParticleEmitterContainer;

  constructor(
    getRandom: () => number,
    particleEmitterContainer: ParticleEmitterContainer
  ) {
    this.getRandom = getRandom;
    this.particleEmitterContainer = particleEmitterContainer;
  }

  getBoltEffect(
    startTime: number,
    startPosition: Vector,
    endPosition: Vector,
    speed: number,
    fade: number,
    duration: number,
    args: BoltArgs,
    context: unknown
  ) {
    return boltEffect.create(
      startTime,
      startPosition,
      endPosition,
      speed,
      fade,
      duration,
      args,
      this.getRandom,
      this.particleEmitterContainer,
      context
    );
  }

  getDamageExplosion(
    size: number,
    type = "glow",
    endPosition: Vector,
    startTime: number,
    context: unknown
  ) {
    return new ExplosionEffect(
      this.particleEmitterContainer,
      this.getRandom,
      {
        position: endPosition.clone(),
        time: startTime,
        duration: 250 + this.getRandom() * 250,
        type,
        size: size || 10,
      },
      context
    );
  }
}

export default ShipWeaponAnimationService;
