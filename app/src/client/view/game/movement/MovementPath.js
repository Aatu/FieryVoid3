import * as THREE from "three";
import {
  getPointBetweenInDistance,
  hexFacingToAngle
} from "../../../../model/utils/math";

import {
  ShipSelectedSprite,
  LineSprite,
  ShipFacingSprite
} from "../renderer/sprite";

class MovementPath {
  constructor(ship, scene, coordinateConverter) {
    this.ship = ship;
    this.scene = scene;
    this.coordinateConverter = coordinateConverter;

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
    const deployMovement = this.ship.movement.getDeployMove(this.ship);

    /*
    if (!deployMovement) {
      return;
    }
    */

    const end = this.ship.movement.getLastEndMoveOrSurrogate();
    const move = this.ship.movement.getLastMove();
    const target = this.ship.movement.getMovementVector();

    const startPosition = end.position;
    const middlePosition = end.position.add(end.target);
    const finalPosition = end.position.add(end.target).add(target);

    const line = createMovementLine(
      startPosition,
      middlePosition,
      this.color,
      this.coordinateConverter,
      0.5
    );
    this.scene.add(line.mesh);
    this.objects.push(line);

    if (!middlePosition.equals(finalPosition)) {
      const middle = createMovementMiddleStep(
        middlePosition,
        this.color,
        this.coordinateConverter
      );
      this.scene.add(middle.mesh);
      this.objects.push(middle);
    }

    const line2 = createMovementLine(
      middlePosition,
      finalPosition,
      this.color,
      this.coordinateConverter
    );
    this.scene.add(line2.mesh);
    this.objects.push(line2);

    const facing = createMovementFacing(
      move.facing,
      finalPosition,
      this.color,
      this.coordinateConverter
    );
    this.scene.add(facing.mesh);
    this.objects.push(facing);
  }
}

const createMovementMiddleStep = (position, color, coordinateConverter) => {
  const size = coordinateConverter.getHexDistance() * 0.5;
  const circle = new ShipSelectedSprite(
    { width: size, height: size },
    0.01,
    1.6
  );
  circle.setPosition(coordinateConverter.fromHexToGame(position));
  circle.setOverlayColor(color);
  circle.setOverlayColorAlpha(1);
  return circle;
};

const createMovementLine = (
  position,
  target,
  color,
  coordinateConverter,
  opacity = 0.8
) => {
  const start = coordinateConverter.fromHexToGame(position);
  const end = coordinateConverter.fromHexToGame(target);

  return new LineSprite(
    getPointBetweenInDistance(
      start,
      end,
      coordinateConverter.getHexDistance() * 0.45,
      true
    ),
    getPointBetweenInDistance(
      end,
      start,
      coordinateConverter.getHexDistance() * 0.45,
      true
    ),
    10,
    color,
    opacity
  );
};

const createMovementFacing = (facing, target, color, coordinateConverter) => {
  const size = coordinateConverter.getHexDistance() * 1.5;
  const facingSprite = new ShipFacingSprite(
    { width: size, height: size },
    0.01,
    1.6,
    facing
  );
  facingSprite.setPosition(coordinateConverter.fromHexToGame(target));
  facingSprite.setOverlayColor(color);
  facingSprite.setOverlayColorAlpha(1);
  facingSprite.setFacing(hexFacingToAngle(facing));

  return facingSprite;
};

export { createMovementLine };

export default MovementPath;
