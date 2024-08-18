import * as THREE from "three";
import {
  changeAttribute,
  PARTICLE_TEXTURE,
  ParticleTexture,
} from "./BaseParticle";
import ParticleEmitter from "./ParticleEmitter";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";
import { degreeToRadian } from "@fieryvoid3/model/src/utils/math";

class StarParticle {
  private material: THREE.Material;
  private geometry: THREE.BufferGeometry;
  public index: number;
  private emitter: ParticleEmitter | null;
  private texture: ParticleTexture = {
    gas: PARTICLE_TEXTURE.GAS,
    bolt: PARTICLE_TEXTURE.BOLT,
    glow: PARTICLE_TEXTURE.GLOW,
    ring: PARTICLE_TEXTURE.RING,
    starLine: PARTICLE_TEXTURE.STARLINE,
  };

  constructor(material: THREE.Material, geometry: THREE.BufferGeometry) {
    this.material = material;
    this.geometry = geometry;
    this.index = 0;
    this.emitter = null;
  }

  create(index: number, emitter: ParticleEmitter | null = null) {
    this.index = index;
    this.emitter = emitter;
    return this;
  }

  setInitialValues() {
    this.setPosition({ x: 0, y: 0, z: 0 });
    this.setColor(new THREE.Color(0, 0, 0));
    this.setOpacity(0.0);
    this.setSize(0.0);
    this.setSizeChange(0.0);
    this.setAngle(0.0);
    this.setAngleChange(0.0);
    this.setActivationTime(0.0);
    this.setTexture(this.texture.glow);
    this.setParallaxFactor(0.0);
    this.setSineFrequency(0.0);
    this.setSineAmplitude(1);

    return this;
  }

  getIndex() {
    return this.index;
  }

  serialize() {
    return {
      index: this.index,
      emitter: this.emitter,
    };
  }

  setTexture(tex: number) {
    changeAttribute(this.geometry, this.index, "textureNumber", tex);

    return this;
  }

  setParallaxFactor(parallaxFactor: number) {
    changeAttribute(
      this.geometry,
      this.index,
      "parallaxFactor",
      -1.0 + parallaxFactor
    );
    return this;
  }

  setSineFrequency(sineFrequency: number) {
    changeAttribute(this.geometry, this.index, "sineFrequency", sineFrequency);
    return this;
  }

  setSineAmplitude(sineAmplitude: number) {
    changeAttribute(this.geometry, this.index, "sineAmplitude", sineAmplitude);
    return this;
  }

  setSize(size: number) {
    changeAttribute(this.geometry, this.index, "size", size);
    return this;
  }

  setSizeChange(size: number) {
    changeAttribute(this.geometry, this.index, "sizeChange", size);
    return this;
  }

  setColor(color: { r: number; g: number; b: number }) {
    changeAttribute(this.geometry, this.index, "color", [
      color.r,
      color.g,
      color.b,
    ]);
    return this;
  }

  setOpacity(opacity: number) {
    changeAttribute(this.geometry, this.index, "opacity", opacity);
    return this;
  }

  setPosition(pos: IVector) {
    changeAttribute(this.geometry, this.index, "position", [
      pos.x,
      pos.y,
      pos.z || 0,
    ]);
    return this;
  }

  setAngle(angle: number) {
    changeAttribute(this.geometry, this.index, "angle", degreeToRadian(angle));
    return this;
  }

  setAngleChange(angle: number) {
    changeAttribute(
      this.geometry,
      this.index,
      "angleChange",
      degreeToRadian(angle)
    );
    return this;
  }

  deactivate() {
    this.setInitialValues();
    return this;
  }

  setActivationTime(gameTime: number) {
    changeAttribute(this.geometry, this.index, "activationGameTime", gameTime);
    return this;
  }
}

export default StarParticle;
