import * as THREE from "three";
import {
  getPointBetweenInDistance,
  hexFacingToAngle,
} from "../../../../model/utils/math";
import coordinateConverter from "../../../../model/utils/CoordinateConverter";

import { CircleSprite, LineSprite } from "../renderer/sprite";

import Line from "../renderer/Line";
import { COLOR_FRIENDLY, COLOR_ENEMY } from "../../../../model/gameConfig.mjs";
import Vector from "../../../../model/utils/Vector.mjs";
import MovementService from "../../../../model/movement/MovementService.mjs";

class MovementPath {
  constructor(ship, scene, ghost, mine) {
    this.ship = ship;
    this.scene = scene;
    this.ghost = ghost;

    this.color = mine ? COLOR_FRIENDLY : COLOR_ENEMY;

    //this.color = new THREE.Color(19 / 255, 96 / 255, 19 / 255);

    this.line = null;

    this.movementService = new MovementService();

    this.create();
  }

  remove() {
    if (this.line) {
      this.line.destroy();
    }
    this.ghost.hide();
  }

  update(ship) {
    this.ship = ship;
    const startMove = this.ship.movement.getLastEndMoveOrSurrogate();
    const endMove = this.movementService.getNewEndMove(this.ship);
    const start = startMove.position;
    const end = endMove.position;
    const facing = endMove.facing;

    if (
      !start.equals(this.start) ||
      !end.equals(this.end) ||
      facing !== this.facing
    ) {
      this.start = start;
      this.end = end;
      this.facing = facing;

      this.createMovementLine(
        this.scene,
        this.start,
        this.end,
        this.color,
        0.5,
        this.ghost.shipZ
      );

      this.createMovementFacing(this.ghost, this.facing, this.end, this.color);
    }
  }

  create() {
    const startMove = this.ship.movement.getLastEndMoveOrSurrogate();
    const endMove = this.movementService.getNewEndMove(this.ship);
    this.start = startMove.position;
    this.end = endMove.position;
    this.facing = endMove.facing;

    this.createMovementLine(
      this.scene,
      this.start,
      this.end,
      this.color,
      0.5,
      this.ghost.shipZ
    );

    this.createMovementFacing(this.ghost, this.facing, this.end, this.color);
  }

  createMovementLine(scene, position, target, color, opacity = 0.8, z) {
    if (!this.line) {
      this.line = new LineSprite(
        new Vector({ x: position.x, y: position.y, z }),
        new Vector({ x: target.x, y: target.y, z }),
        30,
        {
          color,
          opacity,
          type: "dashed-arrow",
          textureSize: 30,
          pulseAmount: 1,
          roundTestureRepeate: true,
        }
      );

      this.line.addTo(scene);
    } else {
      this.line.update(
        new Vector({ x: position.x, y: position.y, z }),
        new Vector({ x: target.x, y: target.y, z }),
        30
      );
    }
  }

  createMovementFacing(ghost, facing, target, color) {
    ghost.show();
    ghost.setPosition(target);
    ghost.setFacing(-hexFacingToAngle(facing));
    ghost.setGhostShipEmissive(color);
    ghost.replaceColor(color.clone().addScalar(-0.2));
    //ghost.setOpacity(0.2);

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
  }
}

export default MovementPath;
