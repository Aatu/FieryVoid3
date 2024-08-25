import ShipWeaponAnimation from "./ShipWeaponAnimation/ShipWeaponAnimation";
import ExplosionEffect from "./effect/ExplosionEffect";
import * as THREE from "three";

import ShipObject from "../renderer/ships/ShipObject";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import { ParticleEmitterContainer } from "./particle";
import { RenderPayload } from "../phase/phaseStrategy/PhaseStrategy";
import EffecSprite from "../renderer/sprite/EffectSprite";
import { PARTICLE_TEXTURE } from "./particle/BaseParticle";

class ShipDestroyedAnimation extends ShipWeaponAnimation {
  private icon: ShipObject;
  private startTime: number;
  private hideTime: number;
  private animations: EffecSprite[];

  constructor(
    icon: ShipObject,
    facing: number,
    position: Vector,
    startTime: number,
    getRandom: () => number,
    particleEmitterContainer: ParticleEmitterContainer,
    scene: THREE.Object3D
  ) {
    super(getRandom, particleEmitterContainer);

    this.animations = [];
    const size =
      icon.dimensions.x > icon.dimensions.y
        ? icon.dimensions.x
        : icon.dimensions.y;

    this.hideTime = 2500;

    this.icon = icon;
    this.startTime = startTime;

    let explosionCount =
      Math.ceil(
        (this.icon.dimensions.x *
          this.icon.dimensions.y *
          this.icon.dimensions.z) /
          10000
      ) + Math.round(getRandom() * 5);

    while (explosionCount--) {
      const explosionPosition = this.getRandomLocationOnShip(
        this.icon,
        facing
      ).add(position);

      new ExplosionEffect(
        this.particleEmitterContainer,
        this.getRandom,
        {
          position: explosionPosition,
          time: startTime + this.getRandom() * 3000,
          duration: 250 + getRandom() * 250,
          type: "gas",
          size: getRandom() * 30 + 10,
          color: new THREE.Color(51 / 255, 163 / 255, 255 / 255),
        },
        this
      );
    }

    const mainExplosionGlow = new EffecSprite(scene, {
      position: position.setZ(icon.shipZ),
      scale: { width: size * 4, height: size * 4 },
      color: new THREE.Color(51 / 255, 163 / 255, 255 / 255),
      texture: PARTICLE_TEXTURE.GLOW,
      fadeInDuration: 500,
      fadeOutTime: 1000,
      fadeOutDuration: 1000,
      activationTime: startTime + 2000,
      scaleChange: 0.001,
      blending: THREE.NormalBlending,
      opacity: 1.0,
    });
    this.animations.push(mainExplosionGlow);

    const secondaryExplosionGlow = new EffecSprite(scene, {
      position: position.setZ(icon.shipZ),
      scale: { width: size * 3, height: size * 3 },
      color: new THREE.Color(1, 1, 1),
      texture: PARTICLE_TEXTURE.GLOW,
      fadeInDuration: 500,
      fadeOutTime: 1000,
      fadeOutDuration: 1000,
      activationTime: startTime + 2000,
      scaleChange: 0.001,
      blending: THREE.AdditiveBlending,
      opacity: 1.0,
    });
    this.animations.push(secondaryExplosionGlow);

    const ring = new EffecSprite(scene, {
      position: position.setZ(icon.shipZ),
      scale: { width: size * 0.8, height: size * 0.8 },
      color: new THREE.Color(51 / 255, 163 / 255, 255 / 255),
      texture: PARTICLE_TEXTURE.RING,
      fadeInDuration: 0,
      fadeOutTime: 200,
      fadeOutDuration: 300,
      activationTime: startTime + 3000,
      scaleChange: 0.03,
      opacity: 0.5,
    });
    this.animations.push(ring);

    /*
    let shootOffs = getRandom() * 100 + 50;

    while (shootOffs--) {
      boltEffect.create(
        this.hideTime,
        position.setZ(icon.shipZ),
        new Vector(endPosition),
        speed * 1.5,
        args.fadeOutSpeed || Math.random() * 500 + 250,
        Math.floor(Math.random() * 500 + 250) / this.speed,
        {
          size: radius / 3,
          color: [color.r, color.g, color.b],
          coreOpacity: 0.1,
          repeat: this.repeat,
        },
        this.getRandom,
        this.emitterContainer,
        this.context
      );
    }

    */
  }

  render(payload: RenderPayload) {
    if (payload.total > this.startTime + this.hideTime) {
      this.icon.hide();
    } else {
      this.icon.show();
    }
    this.animations.forEach((a) => a.render(payload));
  }

  deactivate() {
    this.particleEmitterContainer.release(this);
    this.animations.forEach((a) => a.destroy());

    return super.deactivate();
  }
}

export default ShipDestroyedAnimation;
