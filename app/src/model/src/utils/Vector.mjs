import THREE from "three";
import coordinateConverter from "./CoordinateConverter.mjs";
import { degreeToRadian } from "./math.mjs";

const helperA = new THREE.Vector3();
const helperB = new THREE.Vector3();

class Vector {
  constructor(x = 0, y = 0, z = 0) {
    if (x instanceof THREE.Vector3 || x instanceof Vector) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else if (x instanceof THREE.Vector2) {
      this.x = x.x;
      this.y = x.y;
      this.z = 0;
    } else if (typeof x === "object") {
      this.x = x.x || 0;
      this.y = x.y || 0;
      this.z = x.z || 0;
    } else {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  clone() {
    return new Vector(this.x, this.y, this.z);
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }

  setX(x) {
    return new Vector(x, this.y, this.z);
  }

  setY(y) {
    return new Vector(this.x, y, this.z);
  }

  setZ(z) {
    return new Vector(this.x, this.y, z);
  }

  setFromAngle(a) {
    return new Vector(
      Math.cos(degreeToRadian(a)),
      Math.sin(degreeToRadian(a))
    ).normalize();
  }

  distanceTo(vector) {
    vector = new Vector(vector);
    helperA.set(this.x, this.y, this.z);
    helperB.set(vector.x, vector.y, vector.z);
    return helperA.distanceTo(helperB);
  }

  add(vector) {
    vector = new Vector(vector);
    helperA.set(this.x, this.y, this.z);
    helperB.set(vector.x, vector.y, vector.z);
    helperA.add(helperB);
    return new Vector(helperA.x, helperA.y, helperA.z);
  }

  dot(vector) {
    helperA.set(this.x, this.y, this.z);
    helperB.set(vector.x, vector.y, vector.z);
    return helperA.dot(helperB);
  }

  subtract(vector) {
    return this.sub(vector);
  }

  sub(vector) {
    vector = new Vector(vector);
    helperA.set(this.x, this.y, this.z);
    helperB.set(vector.x, vector.y, vector.z);
    helperA.sub(helperB);
    return new Vector(helperA.x, helperA.y, helperA.z);
  }

  normalize() {
    helperA.set(this.x, this.y, this.z);
    helperA.normalize();
    return new Vector(helperA.x, helperA.y, helperA.z);
  }

  multiplyScalar(scalar) {
    helperA.set(this.x, this.y, this.z);
    helperA.multiplyScalar(scalar);
    return new Vector(helperA.x, helperA.y, helperA.z);
  }

  length() {
    helperA.set(this.x, this.y, this.z);
    return helperA.length();
  }

  applyMatrix4(matrix) {
    helperA.set(this.x, this.y, this.z);

    return new Vector(helperA.applyMatrix4(matrix));
  }

  equals(vector) {
    if (!vector) {
      return false;
    }

    return this.x === vector.x && this.y === vector.y && this.z === vector.z;
  }

  round() {
    return new Vector(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.z)
    );
  }

  roundToHexCenter() {
    return coordinateConverter.fromHexToGame(
      coordinateConverter.fromGameToHex(this)
    );
  }

  toOffset() {
    return coordinateConverter.fromGameToHex(this);
  }

  toString() {
    return `(x:${this.x}, y:${this.y}, z:${this.z})`;
  }

  toThree() {
    return new THREE.Vector3(this.x, this.y, this.z);
  }

  toObject() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }
}

export default Vector;
