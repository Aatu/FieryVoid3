import * as THREE from "three";
import UiStrategy from "../UiStrategy";
import {
  degreeToRadian,
  addToDirection,
  getArcLength,
} from "../../../../../../model/utils/math";
import abstractCanvas from "../../../utils/abstractCanvas";
import { MOVEMENT } from "../../gameUiModes";
import { hexFacingToAngle } from "../../../../../../model/utils/math.mjs";

class WeaponArcsOnSystemMouseOver extends UiStrategy {
  constructor() {
    super();
    this.weaponArcs = [];
  }

  deactivate() {
    this.hide();
  }

  systemMouseOver({ ship, system }) {
    if (!system.callHandler("hasArcs")) {
      return;
    }

    this.show(ship, system);
  }

  torpedoMouseOver({ ship, torpedo }) {
    const { coordinateConverter, shipIconContainer } = this.services;
    const icon = shipIconContainer.getByShip(ship);

    const maxRange = torpedo.maxRange;
    const distance = maxRange * coordinateConverter.getHexDistance();

    const canvas = abstractCanvas.create(maxRange + 1, 1);
    const context = canvas.getContext("2d");

    for (let range = 0; range <= maxRange; range++) {
      const opacity = range < torpedo.minRange ? 0 : 0.5;

      context.fillStyle =
        "rgba(" + 2 + "," + 80 + "," + 128 + "," + opacity + ")";
      context.fillRect(range, 0, 1, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("rgb(20,80,128)"),
      opacity: 1,
      transparent: true,
      map: texture,
    });

    const geometry = new THREE.CircleGeometry(
      distance,
      32,
      degreeToRadian(0),
      degreeToRadian(360)
    );

    geometry.faceVertexUvs = [
      geometry.faceVertexUvs[0].map((_) => [
        new THREE.Vector2(1, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(0, 0),
      ]),
    ];

    geometry.uvsNeedUpdate = true;
    const circle = new THREE.Mesh(geometry, material);
    circle.position.z = -1;
    icon.mesh.add(circle);
    this.weaponArcs.push({ mesh: icon.mesh, circle, texture });
  }

  torpedoMouseOut() {
    this.hide();
  }

  systemMouseOut() {
    this.hide();
  }

  hide() {
    const { scene } = this.services;
    this.weaponArcs = this.weaponArcs.filter(({ mesh, circle, texture }) => {
      mesh.remove(circle);
      circle.material.dispose();
      circle.geometry.dispose();
      texture.dispose();
    });
  }

  getFacing(icon) {
    const { uiState, movementService } = this.services;
    if (uiState.hasGameUiMode(MOVEMENT)) {
      const endMove = movementService.getNewEndMove(icon.ship);
      return hexFacingToAngle(endMove.facing);
    }

    return icon.getFacing();
  }

  getMesh(icon) {
    const { uiState, shipIconContainer } = this.services;
    if (uiState.hasGameUiMode(MOVEMENT)) {
      return shipIconContainer.getGhostShipIconByShip(icon.ship).mesh;
    }

    return icon.mesh;
  }

  show(ship, system) {
    const { coordinateConverter, shipIconContainer } = this.services;
    const icon = shipIconContainer.getByShip(ship);

    const maxRange = system.callHandler("getMaxRange");
    const distance = maxRange * coordinateConverter.getHexDistance();

    const arcsList = system.callHandler("getArcs", {
      facing: this.getFacing(icon),
    });

    const canvas = abstractCanvas.create(maxRange + 1, 1);
    const context = canvas.getContext("2d");

    for (let range = 0; range <= maxRange; range++) {
      const rangePenalty = system.callHandler("getRangeModifier", {
        distance: range,
      });

      const opacity = (100 + rangePenalty) / 100;

      if (opacity < 0) {
        opacity = 0;
      }

      context.fillStyle =
        "rgba(" + 2 + "," + 80 + "," + 128 + "," + opacity + ")";
      context.fillRect(range, 0, 1, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("rgb(20,80,128)"),
      opacity: 1,
      transparent: true,
      map: texture,
    });

    arcsList.forEach((arcs) => {
      const arcLenght =
        arcs.start === arcs.end ? 360 : getArcLength(arcs.start, arcs.end);

      const geometry = new THREE.CircleGeometry(
        distance,
        32,
        degreeToRadian(addToDirection(360, -arcs.end)),
        degreeToRadian(arcLenght)
      );

      geometry.faceVertexUvs = [
        geometry.faceVertexUvs[0].map((intial) => [
          new THREE.Vector2(1, 0),
          new THREE.Vector2(1, 0),
          new THREE.Vector2(0, 0),
        ]),
      ];

      geometry.uvsNeedUpdate = true;
      const circle = new THREE.Mesh(geometry, material);
      circle.position.z = -1;

      const mesh = this.getMesh(icon);
      mesh.add(circle);
      this.weaponArcs.push({ mesh, circle, texture });
    });
  }
}

export default WeaponArcsOnSystemMouseOver;
