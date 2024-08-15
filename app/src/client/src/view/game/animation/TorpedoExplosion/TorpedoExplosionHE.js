import * as THREE from "three";
import ExplosionEffect from "../effect/ExplosionEffect";
import Animation from "../Animation";
import ShipWeaponAnimation from "../ShipWeaponAnimation/ShipWeaponAnimation";

class TorpedoExplosionHE extends ShipWeaponAnimation {
  constructor(
    getPosition,
    time,
    particleEmitterContainer,
    getRandom,
    torpedo,
    targetIcon
  ) {
    super({ getRandom, particleEmitterContainer });
    this.animations = [];

    const { position: targetPosition, facing } = getPosition(targetIcon.ship);
    const position = this.getRandomLocationOnShip(targetIcon, facing).add(
      targetPosition
    );

    const explosionSize = torpedo.visuals.explosionSize;

    this.animations.push(
      new ExplosionEffect(
        particleEmitterContainer,
        getRandom,
        {
          position,
          time: time,
          duration: 250 + getRandom() * 250,
          type: "gas",
          size: getRandom() * (explosionSize * 0.3) + explosionSize,
          color: new THREE.Color(51 / 255, 163 / 255, 255 / 255),
        },
        this
      )
    );

    this.animations.push(
      new ExplosionEffect(
        particleEmitterContainer,
        getRandom,
        {
          position,
          time: time,
          duration: 250 + getRandom() * 250,
          type: "glow",
          size: getRandom() * (explosionSize * 0.2) + explosionSize * 0.4,
        },
        this
      )
    );
  }

  deactivate() {
    this.particleEmitterContainer.release(this);

    return super.deactivate();
  }
}

export default TorpedoExplosionHE;
