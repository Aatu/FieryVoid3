import * as THREE from "three";
import Vector from "../../../model/utils/Vector.mjs";

class GameCamera {
  constructor(zoom, width, height, z) {
    this.ortho = new THREE.OrthographicCamera(
      (zoom * width) / -2,
      (zoom * width) / 2,
      (zoom * height) / 2,
      (zoom * height) / -2,
      -40000,
      40000
    );

    this.z = z;

    this.ortho.position.set(0, 0, z);
    this.orthoCameraAngle = 0;
    this.setCameraAngle(-z * 0.5);

    this.perspective = new THREE.PerspectiveCamera();

    this.current = this.ortho;
  }

  zoomCamera(zoom, width, height) {
    this.ortho.left = (zoom * width) / -2;
    this.ortho.right = (zoom * width) / 2;
    this.ortho.top = (zoom * height) / 2;
    this.ortho.bottom = (zoom * height) / -2;

    this.ortho.updateProjectionMatrix();
    this.ortho.updateMatrixWorld();
  }

  getPosition() {
    return new Vector(this.current.position);
  }

  getLookAtPosition() {
    return new Vector(
      this.ortho.position.x,
      this.ortho.position.y - this.orthoCameraAngle,
      this.ortho.position.z - this.z
    );
  }

  setByLookAtPosition(position) {
    this.ortho.position.x = position.x;
    this.ortho.position.y = position.y + this.orthoCameraAngle;
  }

  addPosition(position) {
    this.ortho.position.x += position.x;
    this.ortho.position.y += position.y;
  }

  setPosition(position) {
    this.ortho.position.x = position.x;
    this.ortho.position.y = position.y;
  }

  getCamera() {
    return this.current;
  }

  setCameraAngle(newAngle) {
    if (newAngle > 0) {
      newAngle = 0;
    }

    if (newAngle < -this.z) {
      newAngle = -this.z;
    }

    var currentLookat = new THREE.Vector3(
      this.ortho.position.x,
      this.ortho.position.y - this.orthoCameraAngle,
      this.ortho.position.z - this.z
    );
    var delta = this.orthoCameraAngle - newAngle;
    this.ortho.position.set(
      this.ortho.position.x,
      this.ortho.position.y - delta,
      this.ortho.position.z
    );
    this.ortho.lookAt(currentLookat);
    this.orthoCameraAngle = newAngle;
  }
}

export default GameCamera;
