import * as THREE from "three";
import ExplosionEffect from "../effect/ExplosionEffect";
import Animation from "../Animation";
import Vector from "../../../../../model/utils/Vector.mjs";

class TorpedoExplosionMSV extends Animation {
  constructor(
    position,
    time,
    particleEmitterContainer,
    getRandom,
    torpedo,
    amount
  ) {
    super();
    this.particleEmitterContainer = particleEmitterContainer;
    this.animations = [];

    //const amount = torpedo.damageStrategy.numberOfShots;
    //console.log(amount);

    const color = new THREE.Color(
      torpedo.visuals.engineColor[0] * 1.5,
      torpedo.visuals.engineColor[1] * 1.5,
      torpedo.visuals.engineColor[2] * 1.5
    );

    for (let i = 0; i < amount; i++) {
      const angle = getRandom() * 360;
      const explosionPosition = new Vector()
        .setFromAngle(angle)
        .multiplyScalar(getRandom() * 10)
        .add(position);

      this.animations.push(
        new ExplosionEffect(
          particleEmitterContainer,
          getRandom,
          {
            position: explosionPosition,
            time: time + getRandom() * 500,
            duration: 100 + getRandom() * 250,
            type: "glow",
            size: 2,
            color: color,
            opacity: 0.25
          },
          this
        )
      );
    }
  }

  deactivate() {
    this.particleEmitterContainer.release(this);

    return super.deactivate();
  }
}

export default TorpedoExplosionMSV;
