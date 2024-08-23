import * as THREE from "three";
import ExplosionEffect from "../effect/ExplosionEffect";
import BoltEffect, { BoltArgs } from "../effect/BoltEffect";
import ShipWeaponAnimation from "../ShipWeaponAnimation/ShipWeaponAnimation";
import ParticleEmitterContainer from "../particle/ParticleEmitterContainer";
import Torpedo from "@fieryvoid3/model/src/unit/system/weapon/ammunition/torpedo/Torpedo";
import ShipObject from "../../renderer/ships/ShipObject";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import MSVTorpedoDamageStrategy from "@fieryvoid3/model/src/unit/system/weapon/ammunition/torpedo/torpedoDamageStrategy/MSVTorpedoDamageStrategy";

class TorpedoExplosionMSV extends ShipWeaponAnimation {
  private animations: ExplosionEffect[];

  constructor(
    startTime: number,
    time: number,
    particleEmitterContainer: ParticleEmitterContainer,
    getRandom: () => number,
    torpedo: Torpedo,
    damages: { entries: { systemId: number }[] }[],
    targetIcon: ShipObject,
    getPosition: (ship: Ship) => { position: Vector; facing: number },
    msvPosition: Vector,
    speed: number = 0.2
  ) {
    super(getRandom, particleEmitterContainer);
    this.particleEmitterContainer = particleEmitterContainer;
    this.animations = [];

    let amount = damages.length;

    const color = new THREE.Color(
      torpedo.visuals.engineColor[0] * 1.5,
      torpedo.visuals.engineColor[1] * 1.5,
      torpedo.visuals.engineColor[2] * 1.5
    );

    const boltArgs: BoltArgs = {
      color: [color.r, color.g, color.b],
      size: 3,
      length: 4,
      coreOpacity: 0.01,
    };

    const boltEffect = new BoltEffect();

    const { position: targetPosition, facing } = getPosition(targetIcon.ship);
    damages.forEach((damage) => {
      const system = targetIcon.ship.systems.getSystemById(
        damage.entries[0].systemId
      );

      const explosionPosition =
        this.getLocationForSystemOrRandomLocationOnSection(
          system,
          targetIcon,
          facing
        ).add(targetPosition);

      const duration = msvPosition.distanceTo(explosionPosition) / speed;

      boltEffect.create(
        startTime,
        msvPosition,
        explosionPosition.clone(),
        speed,
        200,
        duration,
        boltArgs,
        getRandom,
        particleEmitterContainer,
        this
      );

      this.animations.push(
        new ExplosionEffect(
          particleEmitterContainer,
          getRandom,
          {
            position: explosionPosition,
            time: startTime + duration,
            duration: 100 + getRandom() * 250,
            type: "gas",
            size: 8,
            opacity: 0.25,
          },
          this
        )
      );
    });

    const missAmount: number =
      (torpedo.getDamageStrategy() as MSVTorpedoDamageStrategy).numberOfShots -
      amount;

    if (amount < 0) {
      amount = 0;
    }

    for (let i = 0; i < missAmount; i++) {
      const explosionPosition = this.getRandomLocationOnShip(
        targetIcon,
        facing
      ).add(targetPosition);

      boltEffect.create(
        startTime,
        msvPosition,
        explosionPosition,
        speed,
        1000,
        time - startTime + getRandom() * 1000 + 500,
        boltArgs,
        getRandom,
        particleEmitterContainer,
        this
      );
    }
  }

  deactivate() {
    this.particleEmitterContainer.release(this);

    return super.deactivate();
  }
}

export default TorpedoExplosionMSV;
