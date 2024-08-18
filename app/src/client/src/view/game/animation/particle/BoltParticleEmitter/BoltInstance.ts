import * as THREE from "three";
import BoltContainer from "./BoltContainer";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";

const helperVector1 = new THREE.Vector3(1, 0, 0).normalize();
const helperVector2 = new THREE.Vector3();

class BoltInstance {
  private boltContainer: BoltContainer;
  private index: number | null;
  private emitter: BoltContainer | null;

  constructor(boltContainer: BoltContainer) {
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

  setIndex(index: number | null) {
    this.index = index;
    return this;
  }

  getIndex(): number {
    if (this.index === null) {
      throw new Error("BoltInstance has no index");
    }

    return this.index;
  }

  setEmitter(emitter: BoltContainer | null) {
    this.emitter = emitter;
    return this;
  }

  setOpacity(opacity: number) {
    this.boltContainer.setOpacity(this.getIndex(), opacity);
    return this;
  }

  setPosition(position: IVector) {
    this.boltContainer.setPosition(this.getIndex(), position);
    return this;
  }

  setScale(length = 1, width = 1) {
    this.boltContainer.setScale(this.getIndex(), {
      x: length,
      y: width,
      z: width,
    });
    return this;
  }

  setRotation(rotation: IVector) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(
      helperVector1,
      helperVector2.set(rotation.x, rotation.y, rotation.z).normalize()
    );

    this.boltContainer.setQuaternion(this.getIndex(), quaternion);
    return this;
  }

  unsetTexture() {
    this.boltContainer.setTexture(this.getIndex(), -1);
    return this;
  }

  setGasTexture() {
    this.boltContainer.setTexture(this.getIndex(), 0);
    return this;
  }

  setBoltTexture() {
    this.boltContainer.setTexture(this.getIndex(), 1);
    return this;
  }

  setHaloTexture() {
    this.boltContainer.setTexture(this.getIndex(), 2);
    return this;
  }

  setRayTexture() {
    this.boltContainer.setTexture(this.getIndex(), 3);
    return this;
  }

  setColor(color: { r: number; g: number; b: number }) {
    this.boltContainer.setColor(this.getIndex(), color);
    return this;
  }

  setVelocity(velocity: IVector) {
    this.boltContainer.setVelocity(this.getIndex(), velocity);
    return this;
  }

  setActivationTime(time: number) {
    this.boltContainer.setActivationTime(this.getIndex(), time);
    return this;
  }

  setDeactivationTime(time: number, fade: number) {
    this.boltContainer.setDeactivationTime(this.getIndex(), time, fade);
    return this;
  }

  setRepeat(repeat: number) {
    this.boltContainer.setRepeat(this.getIndex(), repeat);
    return this;
  }
}

export default BoltInstance;
