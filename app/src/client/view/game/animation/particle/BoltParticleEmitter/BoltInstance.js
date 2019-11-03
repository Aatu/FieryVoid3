import * as THREE from "three";
import { degreeToRadian } from "../../../../../../model/utils/math.mjs";
import Vector from "../../../../../../model/utils/Vector.mjs";

class BoltInstance {
  constructor(boltContainer) {
    this.boltContainer = boltContainer;
    this.index = null;
  }

  setIndex(index) {
    this.index = index;
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
  }
}

export default BoltInstance;
