import * as THREE from "three";
import UiStrategy from "../UiStrategy";
import abstractCanvas from "../../../utils/abstractCanvas";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import { SYSTEM_HANDLERS } from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";
import Torpedo from "@fieryvoid3/model/src/unit/system/weapon/ammunition/torpedo/Torpedo";
import {
  addToDirection,
  degreeToRadian,
  getArcLength,
  hexFacingToAngle,
} from "@fieryvoid3/model/src/utils/math";
import ShipObject from "../../../renderer/ships/ShipObject";
import { GameUIMode } from "../../gameUiModes";
import { WeaponArc } from "@fieryvoid3/model/src/unit/system/strategy/weapon/WeaponArcStrategy";

class WeaponArcsOnSystemMouseOver extends UiStrategy {
  private weaponArcs: {
    mesh: THREE.Object3D;
    circle: THREE.Mesh;
    texture: THREE.CanvasTexture;
  }[] = [];

  deactivate() {
    this.hide();
  }

  systemMouseOver({ ship, system }: { ship: Ship; system: ShipSystem }) {
    if (
      !system.callHandler(SYSTEM_HANDLERS.hasArcs, undefined, false as boolean)
    ) {
      return;
    }

    this.show(ship, system);
  }

  torpedoMouseOver({ ship, torpedo }: { ship: Ship; torpedo: Torpedo }) {
    const { coordinateConverter, shipIconContainer } = this.getServices();
    const icon = shipIconContainer.getByShip(ship);

    const maxRange = torpedo.maxRange;
    const distance = maxRange * coordinateConverter.getHexDistance();

    const canvas = abstractCanvas.create(maxRange + 1, 1);
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

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

    /*
    geometry.faceVertexUvs = [
      geometry.faceVertexUvs[0].map((_) => [
        new THREE.Vector2(1, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(0, 0),
      ]),
    ];

    geometry.uvsNeedUpdate = true;
    */

    const circle = new THREE.Mesh(geometry, material);
    circle.position.z = -1;
    icon.getMesh().add(circle);
    this.weaponArcs.push({ mesh: icon.getMesh(), circle, texture });
  }

  torpedoMouseOut() {
    this.hide();
  }

  systemMouseOut() {
    this.hide();
  }

  hide() {
    this.weaponArcs = this.weaponArcs.filter(({ mesh, circle, texture }) => {
      mesh.remove(circle);
      ([] as THREE.Material[]).concat(circle.material).forEach((material) => {
        material.dispose();
      });

      circle.geometry.dispose();
      texture.dispose();
    });
  }

  getFacing(icon: ShipObject) {
    const { uiState, movementService } = this.getServices();
    if (uiState.hasGameUiMode(GameUIMode.MOVEMENT)) {
      const endMove = movementService.getNewEndMove(icon.ship);
      return hexFacingToAngle(endMove.facing);
    }

    return icon.getFacing();
  }

  getMesh(icon: ShipObject) {
    const { uiState, shipIconContainer } = this.getServices();
    if (uiState.hasGameUiMode(GameUIMode.MOVEMENT)) {
      return shipIconContainer.getGhostShipIconByShip(icon.ship).getMesh();
    }

    return icon.getMesh();
  }

  show(ship: Ship, system: ShipSystem) {
    const { coordinateConverter, shipIconContainer } = this.getServices();
    const icon = shipIconContainer.getByShip(ship);

    const maxRange = system.callHandler(
      SYSTEM_HANDLERS.getMaxRange,
      undefined,
      0
    );
    const distance = maxRange * coordinateConverter.getHexDistance();

    const arcsList = system.callHandler(
      SYSTEM_HANDLERS.getArcs,
      {
        facing: this.getFacing(icon),
      },
      [] as WeaponArc[]
    );

    const canvas = abstractCanvas.create(maxRange + 1, 1);
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    for (let range = 0; range <= maxRange; range++) {
      const rangePenalty = system.callHandler(
        SYSTEM_HANDLERS.getRangeModifier,
        {
          distance: range,
        },
        0
      );

      let opacity = (100 + rangePenalty) / 100;

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
      //wireframe: true,
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

      modifyCircleUvs(geometry);

      const circle = new THREE.Mesh(geometry, material);
      circle.position.z = -1;

      const mesh = this.getMesh(icon);
      mesh.add(circle);
      this.weaponArcs.push({ mesh, circle, texture });
    });
  }
}

const modifyCircleUvs = (geometry: THREE.CircleGeometry) => {
  const uvAttribute = geometry.getAttribute("uv");
  const positionAttribute = geometry.getAttribute("position");

  for (let i = 0; i < uvAttribute.count; i++) {
    const index = i;

    if (
      positionAttribute.getX(index) !== 0 ||
      positionAttribute.getY(index) !== 0
    ) {
      uvAttribute.setXY(index, 1, 0);
    } else {
      uvAttribute.setXY(index, 0, 0);
    }
  }

  uvAttribute.needsUpdate = true;
};

export default WeaponArcsOnSystemMouseOver;
