import * as THREE from "three";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipObject from "../renderer/ships/ShipObject";
import LineSprite, { LineType } from "../renderer/sprite/LineSprite";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import MovementService from "@fieryvoid3/model/src/movement/MovementService";
import {
  COLOR_ENEMY,
  COLOR_FRIENDLY,
} from "@fieryvoid3/model/src/config/gameConfig";
import { hexFacingToAngle } from "@fieryvoid3/model/src/utils/math";

class MovementPath {
  public ship: Ship;
  private scene: THREE.Object3D;
  private ghost: ShipObject;
  private color: THREE.Color;
  private line: LineSprite | null;
  private start!: Vector;
  private end!: Vector;
  private facing!: number;
  private movementService: MovementService;

  constructor(
    ship: Ship,
    scene: THREE.Object3D,
    ghost: ShipObject,
    mine: boolean
  ) {
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

  update(ship: Ship) {
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

  createMovementLine(
    scene: THREE.Object3D,
    position: Vector,
    target: Vector,
    color: THREE.Color,
    opacity: number,
    z: number
  ) {
    if (!this.line) {
      this.line = new LineSprite(
        new Vector({ x: position.x, y: position.y, z }),
        new Vector({ x: target.x, y: target.y, z }),
        30,
        {
          color,
          opacity,
          type: LineType.DASHED_ARROW,
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

  createMovementFacing(
    ghost: ShipObject,
    facing: number,
    target: Vector,
    color: THREE.Color
  ) {
    ghost.show();
    ghost.setPosition(target);
    ghost.setFacing(-hexFacingToAngle(facing));
    ghost.setGhostShipEmissive(color);
    ghost.replaceColor(color.clone().addScalar(-0.2));
    //ghost.setOpacity(0.2);

    ghost
      .mapIcon!.setMovementTarget()
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
