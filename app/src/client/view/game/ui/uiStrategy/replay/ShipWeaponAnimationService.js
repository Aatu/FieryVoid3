import BoltEffect from "../../../animation/effect/BoltEffect";
import ExplosionEffect from "../../../animation/effect/ExplosionEffect";

const boltEffect = new BoltEffect();

class ShipWeaponAnimationService {
  constructor(getRandom, particleEmitterContainer) {
    this.getRandom = getRandom;
    this.particleEmitterContainer = particleEmitterContainer;
  }

  getBoltEffect(
    startTime,
    startPosition,
    endPosition,
    speed,
    fade,
    duration,
    args,
    context
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

  getDamageExplosion(damage, endPosition, startTime, context) {
    console.log("getDamageExplosion", damage);
    return new ExplosionEffect(
      this.particleEmitterContainer,
      this.getRandom,
      {
        position: endPosition.clone(),
        time: startTime,
        duration: 250 + this.getRandom() * 250,
        type: "glow",
        size: damage.damage
      },
      context
    );
  }
}

export default ShipWeaponAnimationService;