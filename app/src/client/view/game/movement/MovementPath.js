import * as THREE from "three";
import {
  getPointBetweenInDistance,
  hexFacingToAngle
} from "../../../../model/utils/math";
import coordinateConverter from "../../../../model/utils/CoordinateConverter";

import { CircleSprite, LineSprite, ShipFacingSprite } from "../renderer/sprite";

class MovementPath {
  constructor(ship, scene, terrain) {
    this.ship = ship;
    this.scene = scene;
    this.terrain = terrain;

    this.color = new THREE.Color(132 / 255, 165 / 255, 206 / 255);

    this.objects = [];

    this.create();
  }

  remove() {
    this.objects.forEach(object3d => {
      this.scene.remove(object3d.mesh);
      object3d.destroy();
    });
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
      start,
      middle.equals(end) ? end : middle,
      this.color,
      0.5
    );

    this.scene.add(line.mesh);
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
        middle,
        end,
        new THREE.Color(100 / 255, 100 / 255, 255 / 255),
        0.5
      );

      this.scene.add(line2.mesh);
      this.objects.push(line2);
    }

    const facing = createMovementFacing(lastMove.facing, end, this.color);
    this.scene.add(facing.mesh);
    this.objects.push(facing);
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

const createMovementLine = (position, target, color, opacity = 0.8) => {
  return new LineSprite(
    getPointBetweenInDistance(
      position,
      target,
      coordinateConverter.getHexDistance() * 0.45,
      true
    ),
    getPointBetweenInDistance(
      target,
      position,
      coordinateConverter.getHexDistance() * 0.45,
      true
    ),
    10,
    color,
    opacity
  );
};

const createMovementFacing = (facing, target, color) => {
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
};

export { createMovementLine };

export default MovementPath;
