import * as THREE from "three";
import { degreeToRadian } from "../../../../../model/utils/math";
import { radianToDegree } from "../../../../../model/utils/math.mjs";

const changeAttribute = (geometry, index, key, values) => {
  values = [].concat(values);

  var target = geometry.attributes[key].array;

  values.forEach(function (value, i) {
    target[index * values.length + i] = value;
  });

  geometry.attributes[key].needsUpdate = true;
};

export const TEXTURE_GAS = 0;
export const TEXTURE_BOLT = 1;
export const TEXTURE_GLOW = 2;
export const TEXTURE_RING = 3;
export const TEXTURE_STARLINE = 4;

class BaseParticle {
  constructor(material, geometry) {
    this.material = material;
    this.geometry = geometry;
    this.index = 0;
    this.emitter = null;

    this.texture = {
      gas: TEXTURE_GAS,
      bolt: TEXTURE_BOLT,
      glow: TEXTURE_GLOW,
      ring: TEXTURE_RING,
      starLine: TEXTURE_STARLINE,
    };
  }

  create(index, emitter) {
    this.index = index;
    this.emitter = emitter;
    this.setInitialValues();
    return this;
  }

  aquire(index, emitter) {
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

  serialize() {
    return {
      index: this.index,
      emitter: this.emitter,
      opacity: this.geometry.attributes["opacity"].array[this.index],
    };
  }

  getIndex() {
    return this.index;
  }

  setRepeat(repeat) {
    changeAttribute(this.geometry, this.index, "repeat", repeat);
    return this;
  }

  setSine(frequency, amplitude) {
    const value = Math.floor(frequency) + amplitude;
    changeAttribute(this.geometry, this.index, "sine", value);
    return this;
  }

  setTexture(tex) {
    changeAttribute(this.geometry, this.index, "textureNumber", tex);

    return this;
  }

  setSize(size) {
    changeAttribute(this.geometry, this.index, "size", size);
    return this;
  }

  setSizeChange(size) {
    changeAttribute(this.geometry, this.index, "sizeChange", size);
    return this;
  }

  setColor(color) {
    changeAttribute(this.geometry, this.index, "color", [
      color.r,
      color.g,
      color.b,
    ]);
    return this;
  }

  setOpacity(opacity) {
    changeAttribute(this.geometry, this.index, "opacity", opacity);
    return this;
  }

  setFadeIn(time, speed = 1000) {
    changeAttribute(this.geometry, this.index, "fadeInTime", time);
    changeAttribute(this.geometry, this.index, "fadeInSpeed", speed);
    return this;
  }

  setFadeOut(time, speed = 1000) {
    changeAttribute(this.geometry, this.index, "fadeOutTime", time);
    changeAttribute(this.geometry, this.index, "fadeOutSpeed", speed);
    return this;
  }

  setPosition(pos) {
    changeAttribute(
      this.geometry,
      this.index,
      "position",
      [pos.x, pos.y, pos.z],
      true
    );
    return this;
  }

  setAngle(angle, change = 0) {
    const value =
      Math.floor(degreeToRadian(angle) * 1000) +
      Math.floor(degreeToRadian(change) * 1000) * 10000;

    changeAttribute(this.geometry, this.index, "angle", value);
    return this;
  }

  setVelocity(velocity) {
    changeAttribute(this.geometry, this.index, "velocity", [
      velocity.x,
      velocity.y,
      velocity.z,
    ]);
    return this;
  }

  setAcceleration(acceleration) {
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

  setActivationTime(gameTime) {
    changeAttribute(this.geometry, this.index, "activationGameTime", gameTime);
    return this;
  }
}

export default BaseParticle;
