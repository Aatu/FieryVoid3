import * as THREE from "three";
import Vector, { IVector } from "./Vector";
import * as gameConfig from "../config/gameConfig";
import HexagonMath from "./HexagonMath";
import { distance } from "./math";
import { Cube, Offset } from "../hexagon/index";
import { IOffset, isIOffset } from "../hexagon/Offset";

const getShipIcon = (object3d: THREE.Object3D) => {
  do {
    if (object3d.userData.icon) {
      return object3d.userData.icon;
    }
    if (object3d.parent) {
      object3d = object3d.parent;
    }
  } while (object3d.parent);

  return null;
};

type Camera = {
  getCamera: () => THREE.Camera;
};

type Scene = {
  children: THREE.Object3D[];
};

export class CoordinateConverter {
  private hexlenght: number;
  private width: number;
  private height: number;
  private zoom: number;
  private camera: Camera | null;
  private scene: Scene | null;
  private raycaster: THREE.Raycaster;

  constructor() {
    this.hexlenght = gameConfig.HEX_SIZE;
    this.width = 0;
    this.height = 0;
    this.zoom = 1;
    this.camera = null;
    this.scene = null;
    this.raycaster = new THREE.Raycaster();
  }

  init(camera: Camera, scene: Scene) {
    this.camera = camera;
    this.scene = scene;
  }

  getScene(): Scene {
    if (!this.scene) {
      throw new Error("Scene not initialized");
    }

    return this.scene;
  }

  getCamera(): Camera {
    if (!this.camera) {
      throw new Error("Camera not initialized");
    }

    return this.camera;
  }

  onResize({ width, height }: { width: number; height: number }) {
    this.width = width;
    this.height = height;
  }

  onZoom(zoom: number) {
    this.zoom = zoom;
  }

  fromHexToViewport(hex: Cube | Offset | IOffset) {
    return this.fromGameToViewPort(this.fromHexToGame(hex));
  }

  getHexHeightViewport() {
    return HexagonMath.getHexHeight() / this.zoom;
  }

  getHexDistance() {
    const hex1 = new Offset(0, 0);
    const hex2 = hex1.getNeighbourAtDirection(0);

    return distance(this.fromHexToGame(hex1), this.fromHexToGame(hex2));
  }

  fromGameToHex(gameCoordinates: Vector | IVector): Offset {
    const q =
      ((1 / 3) * Math.sqrt(3) * gameCoordinates.x -
        (1 / 3) * gameCoordinates.y) /
      this.hexlenght;
    const r = ((2 / 3) * gameCoordinates.y) / this.hexlenght;

    const x = q;
    const z = r;
    const y = -x - z;

    return new Cube(x, y, z).round().toOffset();
  }

  fromHexToGame(offsetHex: Cube | Offset | IOffset): Vector {
    if (offsetHex instanceof Cube) {
      offsetHex = offsetHex.toOffset();
    }

    if (isIOffset(offsetHex)) {
      offsetHex = new Offset(offsetHex.q, offsetHex.r);
    }

    const x =
      this.hexlenght * Math.sqrt(3) * (offsetHex.q - 0.5 * (offsetHex.r & 1));
    const y = ((this.hexlenght * 3) / 2) * offsetHex.r;

    return new Vector(x, y, 0);
  }

  fromViewPortToGame(pos: { x: number; y: number; xR: number; yR: number }) {
    var result = {
      x: 0,
      y: 0,
      z: 0,
    };

    this.raycaster.setFromCamera(
      new THREE.Vector2(pos.xR, pos.yR),
      this.getCamera().getCamera()
    );
    const intersects = this.raycaster.intersectObjects(
      this.getScene().children,
      true
    );

    intersects.forEach(function (intersected) {
      if (intersected.object.name === "hexgrid") {
        result.x = intersected.point.x;
        result.y = intersected.point.y;
        result.z = intersected.point.z;
      }
    });

    return result;
  }

  getEntitiesIntersected(pos: { xR: number; yR: number }) {
    const result: unknown[] = [];

    this.raycaster.setFromCamera(
      new THREE.Vector2(pos.xR, pos.yR),
      this.getCamera().getCamera()
    );
    var intersects = this.raycaster.intersectObjects(
      this.getScene().children,
      true
    );

    intersects.forEach(function (intersected) {
      if (intersected.object.name !== "hexgrid") {
        var icon = getShipIcon(intersected.object);

        icon && !result.includes(icon) && result.push(icon);
      }
    });

    return result;
  }

  fromGameToViewPort(pos: IVector) {
    var vector = new THREE.Vector3();
    vector.set(pos.x, pos.y, pos.z || 0);

    // map to normalized device coordinate (NDC) space
    vector.project(this.getCamera().getCamera());

    // map to 2D screen space
    vector.x = Math.round(((vector.x + 1) * this.width) / 2);
    vector.y = Math.round(((-vector.y + 1) * this.height) / 2);
    vector.z = 0;

    return {
      x: vector.x,
      y: vector.y,
    };

    /*
        var cameraPos = this.camera.position;
        var zoom = this.zoom;
        var windowDimensions = { width: this.width, height: this.height };

        var positionFromCamera = { x: pos.x - cameraPos.x, y: pos.y - cameraPos.y };
        var withZoom = { x: positionFromCamera.x / zoom, y: positionFromCamera.y / zoom };
        var positionFromCenterOfScreen = { x: withZoom.x + windowDimensions.width / 2, y: windowDimensions.height / 2 - withZoom.y };

        return positionFromCenterOfScreen;
        */
  }
}

const coordinateConverter = new CoordinateConverter();
export default coordinateConverter;
