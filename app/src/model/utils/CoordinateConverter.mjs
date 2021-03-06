import THREE from "three";
import Vector from "./Vector.mjs";
import * as gameConfig from "../gameConfig.mjs";
import hexagon from "../hexagon/index.mjs";
import HexagonMath from "./HexagonMath.mjs";
import { distance } from "./math.mjs";

const getShipIcon = object3d => {
  do {
    if (object3d.userData.icon) {
      return object3d.userData.icon;
    }
    object3d = object3d.parent;
  } while (object3d.parent);

  return null;
};

class CoordinateConverter {
  constructor() {
    this.hexlenght = gameConfig.HEX_SIZE;
    this.width = 0;
    this.height = 0;
    this.zoom = 1;
    this.camera = null;
    this.scene = null;
    this.raycaster = new THREE.Raycaster();
  }

  init(camera, scene) {
    this.camera = camera;
    this.scene = scene;
  }

  onResize({ width, height }) {
    this.width = width;
    this.height = height;
  }

  onZoom(zoom) {
    this.zoom = zoom;
  }

  fromHexToViewport(hex) {
    return this.fromGameToViewPort(this.fromHexToGame(hex));
  }

  getHexHeightViewport() {
    return HexagonMath.getHexHeight() / this.zoom;
  }

  getHexDistance() {
    var hex1 = new hexagon.Offset(0, 0);
    var hex2 = hex1.getNeighbourAtDirection(0);

    return distance(this.fromHexToGame(hex1), this.fromHexToGame(hex2));
  }

  fromGameToHex(gameCoordinates) {
    if (!gameCoordinates) {
      console.trace();
    }
    var q =
      ((1 / 3) * Math.sqrt(3) * gameCoordinates.x -
        (1 / 3) * gameCoordinates.y) /
      this.hexlenght;
    var r = ((2 / 3) * gameCoordinates.y) / this.hexlenght;

    var x = q;
    var z = r;
    var y = -x - z;

    return new hexagon.Cube(x, y, z).round().toOffset();
  }

  fromHexToGame(offsetHex) {
    if (offsetHex instanceof hexagon.Cube) {
      offsetHex = offsetHex.toOffset();
    }

    if (!(offsetHex instanceof hexagon.Offset)) {
      offsetHex = new hexagon.Offset(offsetHex.q, offsetHex.r);
    }

    var x =
      this.hexlenght * Math.sqrt(3) * (offsetHex.q - 0.5 * (offsetHex.r & 1));
    var y = ((this.hexlenght * 3) / 2) * offsetHex.r;

    return new Vector(x, y, 0);
  }

  fromViewPortToGame(pos) {
    var result = {
      x: 0,
      y: 0,
      z: 0
    };

    this.raycaster.setFromCamera(
      { x: pos.xR, y: pos.yR },
      this.camera.getCamera()
    );
    var intersects = this.raycaster.intersectObjects(this.scene.children, true);

    intersects.forEach(function(intersected) {
      if (intersected.object.name === "hexgrid") {
        result.x = intersected.point.x;
        result.y = intersected.point.y;
        result.z = intersected.point.z;
      }
    });

    return result;
  }

  getEntitiesIntersected(pos, debug = false) {
    var result = [];

    this.raycaster.setFromCamera(
      { x: pos.xR, y: pos.yR },
      this.camera.getCamera()
    );
    var intersects = this.raycaster.intersectObjects(this.scene.children, true);

    intersects.forEach(function(intersected) {
      if (intersected.object.name !== "hexgrid") {
        var icon = getShipIcon(intersected.object);

        icon && !result.includes(icon) && result.push(icon);
      }
    });

    return result;
  }

  fromGameToViewPort(pos) {
    var vector = new THREE.Vector3();
    vector.set(pos.x, pos.y, pos.z || 0);

    // map to normalized device coordinate (NDC) space
    vector.project(this.camera.getCamera());

    // map to 2D screen space
    vector.x = Math.round(((vector.x + 1) * this.width) / 2);
    vector.y = Math.round(((-vector.y + 1) * this.height) / 2);
    vector.z = 0;

    return {
      x: vector.x,
      y: vector.y
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
