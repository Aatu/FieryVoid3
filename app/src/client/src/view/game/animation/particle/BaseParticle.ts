import * as THREE from "three";
import ParticleEmitter from "./ParticleEmitter";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";
import {
  retrieveOpacityAndFade,
  storeAngleAndChange,
  storeOpacityAndFade,
} from "@fieryvoid3/model/src/utils/bitmasked";

export type SerializedParticle = {
  index: number;
  emitter: ParticleEmitter;
  opacity: number;
};

export const changeAttribute = (
  geometry: THREE.BufferGeometry,
  index: number,
  key: string,
  values: number[] | number
) => {
  values = ([] as number[]).concat(values);

  const target = geometry.attributes[key].array;

  values.forEach((value, i) => {
    target[index * values.length + i] = value;
  });

  geometry.attributes[key].needsUpdate = true;
};

export enum PARTICLE_TEXTURE {
  GAS = 0,
  BOLT = 1,
  GLOW = 2,
  RING = 3,
  STARLINE = 4,
  RING_FILLED = 5,
}

export type ParticleTexture = {
  gas: PARTICLE_TEXTURE;
  bolt: PARTICLE_TEXTURE;
  glow: PARTICLE_TEXTURE;
  ring: PARTICLE_TEXTURE;
  starLine: PARTICLE_TEXTURE;
};

class BaseParticle {
  public material: THREE.Material;
  public geometry: THREE.BufferGeometry;
  private index: number;
  private emitter: ParticleEmitter | null = null;
  public texture: ParticleTexture = {
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
  }

  create(index: number, emitter: ParticleEmitter | null = null) {
    this.index = index;
    this.emitter = emitter;
    this.setInitialValues();
    return this;
  }

  aquire(index: number, emitter: ParticleEmitter | null = null) {
    this.index = index;
    this.emitter = emitter;
    return this;
  }

  setInitialValues() {
    this.setPosition({ x: 0, y: 0, z: 0 });
    this.setColor(new THREE.Color(0, 0, 0));
    this.setOpacity(0.0);
    this.setFadeIn(0.0, 0.0);
    this.setFadeOut(0.0, 0.0);
    this.setSize(0.0);
    this.setSizeChange(0.0);
    this.setAngle(0.0, 0.0);
    this.setActivationTime(0.0);
    this.setVelocity(new THREE.Vector3(0, 0, 0));
    this.setAcceleration(new THREE.Vector3(0, 0, 0));
    this.setTexture(this.texture.glow);
    this.setRepeat(0);

    return this;
  }

  serialize(): SerializedParticle {
    return {
      index: this.index,
      emitter: this.emitter!,
      opacity: this.geometry.attributes["opacity"].array[this.index],
    };
  }

  getIndex() {
    return this.index;
  }

  setRepeat(repeat: number) {
    changeAttribute(this.geometry, this.index, "repeat", repeat);
    return this;
  }

  setSine(frequency: number, amplitude: number) {
    const value = Math.floor(frequency) + amplitude;
    changeAttribute(this.geometry, this.index, "sine", value);
    return this;
  }

  setTexture(tex: number) {
    changeAttribute(this.geometry, this.index, "textureNumber", tex);

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
    this.changeOpacity(opacity);
    return this;
  }

  setFadeIn(time: number, speed: number = 1000) {
    changeAttribute(this.geometry, this.index, "fadeInTime", time);
    this.changeFadeInSpeed(speed);
    return this;
  }

  setFadeOut(time: number, speed: number = 1000) {
    changeAttribute(this.geometry, this.index, "fadeOutTime", time);
    this.changeFadeOutSpeed(speed);
    return this;
  }

  setPosition(pos: IVector) {
    changeAttribute(this.geometry, this.index, "position", [
      pos.x,
      pos.y,
      pos.z,
    ]);
    return this;
  }

  setAngle(angle: number, change: number = 0) {
    /*
    const value =
      Math.floor(degreeToRadian(angle) * 1000) +
      Math.floor(degreeToRadian(change) * 1000) * 10000;
      */

    const value = storeAngleAndChange(angle, change);
    changeAttribute(this.geometry, this.index, "angle", value);
    return this;
  }

  setVelocity(velocity: IVector) {
    changeAttribute(this.geometry, this.index, "velocity", [
      velocity.x,
      velocity.y,
      velocity.z,
    ]);
    return this;
  }

  setAcceleration(acceleration: IVector) {
    changeAttribute(this.geometry, this.index, "acceleration", [
      acceleration.x,
      acceleration.y,
      acceleration.z,
    ]);
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

  private changeOpacity(newOpacity: number) {
    const target = this.geometry.attributes["opacityAndFadeSpeeds"].array;
    const value = target[this.index];

    const { fadeInSpeed, fadeOutSpeed } = retrieveOpacityAndFade(value);

    const newValue = storeOpacityAndFade(newOpacity, fadeInSpeed, fadeOutSpeed);

    target[this.index] = newValue;

    this.geometry.attributes["opacityAndFadeSpeeds"].needsUpdate = true;
  }

  private changeFadeOutSpeed(newFadeOutSpeed: number) {
    const target = this.geometry.attributes["opacityAndFadeSpeeds"].array;
    const value = target[this.index];

    const { opacity, fadeInSpeed } = retrieveOpacityAndFade(value);

    const newValue = storeOpacityAndFade(opacity, fadeInSpeed, newFadeOutSpeed);

    target[this.index] = newValue;

    this.geometry.attributes["opacityAndFadeSpeeds"].needsUpdate = true;
  }

  private changeFadeInSpeed(newFadeInSpeed: number) {
    const target = this.geometry.attributes["opacityAndFadeSpeeds"].array;
    const value = target[this.index];

    const { opacity, fadeOutSpeed } = retrieveOpacityAndFade(value);

    const newValue = storeOpacityAndFade(opacity, newFadeInSpeed, fadeOutSpeed);

    target[this.index] = newValue;

    this.geometry.attributes["opacityAndFadeSpeeds"].needsUpdate = true;
  }
}

export default BaseParticle;
