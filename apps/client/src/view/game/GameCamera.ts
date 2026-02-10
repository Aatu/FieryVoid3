import { ZOOM_PERSPECTIVE_MIN } from "@fieryvoid3/model/src/config/gameConfig";
import { degreeToRadian } from "@fieryvoid3/model/src/utils/math";
import Vector, { IVector } from "@fieryvoid3/model/src/utils/Vector";
import * as THREE from "three";

class GameCamera {
  private ortho: THREE.OrthographicCamera;
  private z: number;
  private orthoCameraAngle: number;
  private perspectiveRatio: number;
  private perspectiveFieldOfView: number;
  private perspective: THREE.PerspectiveCamera;
  private perspectiveCameraDistance: number;
  private closeAngle: number;
  private current: THREE.Camera;

  constructor(zoom: number, width: number, height: number, z: number) {
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

    this.perspectiveRatio = 10;
    this.perspectiveFieldOfView = 25;

    this.perspective = new THREE.PerspectiveCamera(
      this.perspectiveFieldOfView,
      width / height,
      1,
      100000
    );

    this.perspectiveCameraDistance = 1;

    this.closeAngle = -z * 0.5;

    this.setCameraAngle(this.closeAngle);

    this.current = this.perspective;
  }

  changeToMapView() {
    this.setCameraAngle(0);
    this.current = this.ortho;
  }

  changeToCloseView() {
    this.setCameraAngle(this.closeAngle);
    this.current = this.perspective;
  }

  solvePerspectiveSize() {
    const adjacent = this.perspective.position.z;
    const hypotenuse =
      adjacent / Math.cos(degreeToRadian(this.perspectiveFieldOfView / 2));

    const opposite =
      Math.sin(degreeToRadian(this.perspectiveFieldOfView / 2)) * hypotenuse;

    return {
      width: opposite * 3 * this.perspective.aspect,
      height: opposite * 2,
    };
  }

  changeCamera() {
    if (this.current === this.perspective) {
      this.current = this.ortho;
    } else {
      this.current = this.perspective;
    }
  }

  zoomPerspective(zoom: number, width: number, height: number) {
    const current = this.solvePerspectiveSize();
    const perspectiveZoom = current.height / (height * zoom);
    this.perspectiveCameraDistance /= perspectiveZoom;

    if (this.perspectiveCameraDistance < ZOOM_PERSPECTIVE_MIN) {
      this.perspectiveCameraDistance = ZOOM_PERSPECTIVE_MIN;
    }

    this.setPerspectiveCameraPositionByLookat(this.getLookAtPosition());
  }

  zoomCamera(zoom: number, width: number, height: number) {
    this.ortho.left = (zoom * width) / -2;
    this.ortho.right = (zoom * width) / 2;
    this.ortho.top = (zoom * height) / 2;
    this.ortho.bottom = (zoom * height) / -2;

    this.perspective.aspect = width / height;
    this.perspective.zoom = 1;
    this.zoomPerspective(zoom, width, height);
    //this.perspective.position.z = 1000;
    this.perspective.updateProjectionMatrix();
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

  setByLookAtPosition(position: { x: number; y: number }) {
    this.ortho.position.x = position.x;
    this.ortho.position.y = position.y + this.orthoCameraAngle;
    this.setPerspectiveCameraPositionByLookat(this.getLookAtPosition());
  }

  addPosition(position: { x: number; y: number }) {
    this.ortho.position.x += position.x;
    this.ortho.position.y += position.y;
    this.perspective.position.x += position.x;
    this.perspective.position.y += position.y;
  }

  setPosition(position: { x: number; y: number }) {
    this.ortho.position.x = position.x;
    this.ortho.position.y = position.y;
    this.perspective.position.x += position.x;
    this.perspective.position.y += position.y;
  }

  getCamera() {
    return this.current;
  }

  setPerspectiveCameraPositionByLookat(lookAt: IVector) {
    const perspectivePositionVector = new Vector(
      0,
      this.orthoCameraAngle / this.perspectiveRatio,
      this.z / this.perspectiveRatio
    ).normalize();

    const perspectivePosition = new Vector(lookAt).add(
      perspectivePositionVector.multiplyScalar(this.perspectiveCameraDistance)
    );

    this.perspective.position.set(
      perspectivePosition.x,
      perspectivePosition.y,
      perspectivePosition.z
    );

    this.perspective.lookAt(new Vector(lookAt).toThree());
  }

  setCameraAngle(newAngle: number) {
    if (newAngle > 0) {
      newAngle = 0;
    }

    if (newAngle < -this.z) {
      newAngle = -this.z;
    }

    const currentLookat = this.getLookAtPosition().toThree();

    const delta = this.orthoCameraAngle - newAngle;

    this.ortho.position.set(
      this.ortho.position.x,
      this.ortho.position.y - delta,
      this.ortho.position.z
    );
    this.ortho.lookAt(currentLookat);
    this.orthoCameraAngle = newAngle;

    this.setPerspectiveCameraPositionByLookat(currentLookat);
  }
}

export default GameCamera;
