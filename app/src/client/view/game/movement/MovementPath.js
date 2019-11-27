import * as THREE from "three";
import {
  getPointBetweenInDistance,
  hexFacingToAngle
} from "../../../../model/utils/math";
import coordinateConverter from "../../../../model/utils/CoordinateConverter";

import { CircleSprite, LineSprite } from "../renderer/sprite";

import Line from "../renderer/Line";
import { COLOR_FRIENDLY, COLOR_ENEMY } from "../../../../model/gameConfig.mjs";
import Vector from "../../../../model/utils/Vector.mjs";

class MovementPath {
  constructor(ship, scene, terrain, ghost, mine) {
    this.ship = ship;
    this.scene = scene;
    this.terrain = terrain;
    this.ghost = ghost;

    this.color = mine ? COLOR_FRIENDLY : COLOR_ENEMY;

    //this.color = new THREE.Color(19 / 255, 96 / 255, 19 / 255);

    this.objects = [];

    this.create();
  }

  remove() {
    this.objects.forEach(object3d => {
      this.scene.remove(object3d.mesh);
      object3d.destroy();
    });
    this.ghost.hide();
  }

  create() {
    const startMove = this.ship.movement.getLastEndMoveOrSurrogate();
    const lastMove = this.ship.movement.getLastMove();
    const velocity = this.ship.movement.getMovementVector();
    const positionWithoutGravity = startMove.position.add(velocity);

    const { position } = this.terrain.getGravityVectorForTurn(
      startMove.position,
      this.ship.movement.getMovementVector(),
      startMove.turn
    );

    const start = startMove.position.roundToHexCenter();
    const middle = positionWithoutGravity.roundToHexCenter();
    const end = position.roundToHexCenter();

    const line = createMovementLine(
      this.scene,
      start,
      middle.equals(end) ? end : middle,
      this.color,
      0.5,
      this.ghost.shipZ
    );

    this.objects.push(line);

    if (!middle.equals(end)) {
      const dot = createMovementMiddleStep(
        middle,
        this.color,
        this.coordinateConverter
      );
      this.scene.add(dot.mesh);
      this.objects.push(dot);

      const line2 = createMovementLine(
        this.scene,
        middle,
        end,
        new THREE.Color(100 / 255, 100 / 255, 255 / 255),
        0.5
      );

      this.objects.push(line2);
    }

    createMovementFacing(this.ghost, lastMove.facing, start, this.color);
  }
}

const createMovementMiddleStep = (position, color) => {
  const size = coordinateConverter.getHexDistance() * 0.5;
  const circle = new CircleSprite({ width: size, height: size }, 0.01, 1.6);
  circle.setPosition(position);
  circle.setOverlayColor(color);
  circle.setOverlayColorAlpha(1);
  return circle;
};

const createMovementLine = (
  scene,
  position,
  target,
  color,
  opacity = 0.8,
  z
) => {
  const line = new LineSprite(
    new Vector({ x: position.x, y: position.y, z }),
    new Vector({ x: target.x, y: target.y, z }),
    30,
    {
      color,
      opacity,
      type: "dashed-arrow",
      textureSize: 30,
      pulseAmount: 1,
      roundTestureRepeate: true
    }
  );

  line.addTo(scene);

  return line;
};

const createMovementFacing = (ghost, facing, target, color) => {
  ghost.show();
  ghost.setPosition(target);
  ghost.setFacing(-hexFacingToAngle(facing));
  ghost.setGhostShipEmissive(color);
  ghost.setOpacity(0.2);

  ghost.mapIcon
    .setMovementTarget()
    .replaceColor(color)
    .setOverlayColorAlpha(1)
    .show();
  /*
  const size = coordinateConverter.getHexDistance() * 1.5;
  const facingSprite = new ShipFacingSprite(
    { width: size, height: size },
    0.01,
    1.6,
    facing
  );
  facingSprite.setPosition(target);
  facingSprite.setOverlayColor(color);
  facingSprite.setOverlayColorAlpha(1);
  facingSprite.setFacing(hexFacingToAngle(facing));

  return facingSprite;
  */
};

export { createMovementLine };

export default MovementPath;
