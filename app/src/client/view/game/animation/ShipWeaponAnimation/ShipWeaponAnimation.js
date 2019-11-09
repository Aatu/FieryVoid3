import Animation from "../Animation";
import Vector from "../../../../../model/utils/Vector";
import ExplosionEffect from "../effect/ExplosionEffect";

class ShipWeaponAnimation extends Animation {
  constructor(getRandom) {
    super(getRandom);
  }

  createDamageExplosion(damage, endPosition, startTime) {
    this.animations.push(
      new ExplosionEffect(this.particleEmitterContainer, this.getRandom, {
        position: endPosition.clone(),
        time: startTime,
        duration: 250 + this.getRandom() * 250,
        type: "glow",
        size: damage.damage
      })
    );
  }
}

export default ShipWeaponAnimation;
