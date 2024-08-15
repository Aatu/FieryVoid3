import * as THREE from "three";
import { degreeToRadian } from "../../../../../../model/utils/math";
import Vector from "../../../../../../model/utils/Vector";

class BoltInstance {
  constructor(boltContainer) {
    this.boltContainer = boltContainer;
    this.index = null;
    this.emitter = null;
  }

  serialize() {
    return {
      index: this.index,
      emitter: this.emitter,
    };
  }

  setIndex(index) {
    this.index = index;
    return this;
  }

  setEmitter(emitter) {
    this.emitter = emitter;
    return this;
  }

  setOpacity(opacity) {
    this.boltContainer.setOpacity(this.index, opacity);
    return this;
  }

  setPosition(position) {
    this.boltContainer.setPosition(this.index, position);
    return this;
  }

  setScale(length = 1, width = 1) {
    this.boltContainer.setScale(this.index, { x: length, y: width, z: width });
    return this;
  }

  setRotation(rotation) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(
      new THREE.Vector3(1, 0, 0).normalize(),
      new Vector(rotation).normalize()
    );

    this.boltContainer.setQuaternion(this.index, quaternion);
    return this;
  }

  unsetTexture() {
    this.boltContainer.setTexture(this.index, -1);
    return this;
  }

  setGasTexture() {
    this.boltContainer.setTexture(this.index, 0);
    return this;
  }

  setBoltTexture() {
    this.boltContainer.setTexture(this.index, 1);
    return this;
  }

  setHaloTexture() {
    this.boltContainer.setTexture(this.index, 2);
    return this;
  }

  setRayTexture() {
    this.boltContainer.setTexture(this.index, 3);
    return this;
  }

  setColor(color) {
    this.boltContainer.setColor(this.index, color);
    return this;
  }

  setVelocity(velocity) {
    this.boltContainer.setVelocity(this.index, velocity);
    return this;
  }

  setActivationTime(time) {
    this.boltContainer.setActivationTime(this.index, time);
    return this;
  }

  setDeactivationTime(time, fade) {
    this.boltContainer.setDeactivationTime(this.index, time, fade);
    return this;
  }

  setRepeat(repeat) {
    this.boltContainer.setRepeat(this.index, repeat);
    return this;
  }
}

export default BoltInstance;
