import * as THREE from "three";
import Animation from "../Animation";
import PivotSteps from "./PivotSteps";
import ShipObject from "../../renderer/ships/ShipObject";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { MovementOrder } from "@fieryvoid3/model/src/movement";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";
import {
  addToDirection,
  getAngleBetween,
} from "@fieryvoid3/model/src/utils/math";

class ShipMovementAnimation extends Animation {
  private shipIcon: ShipObject;
  private ship: Ship;
  private startTime: number;
  private end: number;
  private positionCurves: THREE.CubicBezierCurve3[];
  private pivotSteps: PivotSteps;
  private startRoll: number;
  private endRoll: number;
  private easeInOut: THREE.CubicBezierCurve;

  constructor(
    shipIcon: ShipObject,
    ship: Ship,
    moves: MovementOrder[],
    start: number,
    end: number
  ) {
    super();

    this.shipIcon = shipIcon;
    this.ship = ship;

    this.startTime = start;
    this.end = end;

    this.duration = end - start;

    this.positionCurves = this.movesToCurves(moves);
    this.pivotSteps = new PivotSteps(moves);

    this.startRoll = moves[0].rolled ? 180 : 0;
    this.endRoll =
      moves[0].rolled === moves[moves.length - 1].rolled
        ? this.startRoll
        : this.startRoll + 180;

    this.easeInOut = new THREE.CubicBezierCurve(
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.75, 0),
      new THREE.Vector2(0.25, 1),
      new THREE.Vector2(1, 1)
    );

    /*

    this.positionCurve = this.buildPositionCurve();
    this.rotations = this.buildRotations();
    this.evasionOffset = new ShipEvasionMovementPath(
      this.turn * this.ship.id,
      this.movementService.getEvasion(this.ship)
    );

    /*
    this.turnCurve = new THREE.CubicBezierCurve(
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.25, 0.25),
      new THREE.Vector2(0.75, 0.75),
      new THREE.Vector2(1, 1)
    );

    */
  }

  doesMove() {
    return !new Vector(this.positionCurves[0].getPoint(0)).equals(
      new Vector(this.positionCurves[0].getPoint(1))
    );
  }

  deactivate() {}

  update() {}

  cleanUp() {}

  getEndPosition() {
    return this.getPositionAndFacing(1, 1);
  }

  getPositionAt(time: number) {
    const turnDone = this.getMovementTurnDone(time);

    const turn = Math.floor(turnDone);
    const percentDone = turnDone < 1 ? turnDone % 1 : 1;

    return this.getPositionAndFacing(turn, percentDone);
  }

  getMovementTurnDone(total: number) {
    if (total < this.startTime) {
      return 0;
    }

    if (total > this.end) {
      return 1;
    }

    const time = total - this.startTime;
    return time / this.duration;
  }

  getCurrentRoll(turnDone: number) {
    const between = -getAngleBetween(this.startRoll, this.endRoll, false);
    if (between === 0) {
      return this.endRoll;
    }

    return addToDirection(
      this.startRoll,
      between * this.easeInOut.getPoint(turnDone).y
    );
  }

  render(payload: RenderPayload) {
    if (this.ship.isDestroyed() && !this.ship.isDestroyedThisTurn()) {
      this.shipIcon.hide();
      return;
    }

    const turnDone = this.getMovementTurnDone(payload.total);

    const turn = Math.floor(turnDone);
    const percentDone = turnDone < 1 ? turnDone % 1 : 1;

    const { position, facing } = this.getPositionAndFacing(turn, percentDone);

    const roll = this.getCurrentRoll(turnDone);
    this.shipIcon.setPosition(position);
    this.shipIcon.setFacing(-facing);
    this.shipIcon.setRoll(roll);
  }

  getPositionAndFacing(turn: number, percentDone: number) {
    const position = this.positionCurves[turn]
      ? this.positionCurves[turn].getPoint(percentDone)
      : this.positionCurves[this.positionCurves.length - 1].getPoint(1);

    const facing = this.pivotSteps.getFacing(turn, percentDone);

    return { position, facing };
  }

  movesToCurves(moves: MovementOrder[]) {
    const startsAndEnds: { start: MovementOrder; end: MovementOrder }[] = [];
    let start: MovementOrder | null = null;

    moves.forEach((move) => {
      if (move.isDeploy()) {
        start = move;
      } else if (move.isEnd() && !start) {
        start = move;
      } else if (move.isEnd()) {
        startsAndEnds.push({
          start: start!,
          end: move,
        });

        start = move;
      }
    });

    const curves = startsAndEnds.map(({ start, end }) =>
      this.buildPositionCurve(start, end)
    );

    return curves;
  }

  buildPositionCurve(start: MovementOrder, end: MovementOrder) {
    const startPosition = start.position;

    const point1 = startPosition.roundToHexCenter();
    const control1 = startPosition.roundToHexCenter();
    const control2 = end.position.roundToHexCenter();
    const point2 = end.position.roundToHexCenter();

    /*
    const point1 = start.position.roundToHexCenter();
    const control1 = start.position.add(start.velocity.multiplyScalar(0.5));
    const control2 = end.position.sub(end.velocity.multiplyScalar(0.5));
    const point2 = end.position.roundToHexCenter();
    */

    /*
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(point1.x, point1.y, point1.z),
      new THREE.Vector3(control1.x, control1.y, control1.z),
      new THREE.Vector3(point2.x, point2.y, point2.z)
    );
    */

    return new THREE.CubicBezierCurve3(
      new THREE.Vector3(point1.x, point1.y, point1.z),
      new THREE.Vector3(control1.x, control1.y, control1.z),
      new THREE.Vector3(control2.x, control2.y, control2.z),
      new THREE.Vector3(point2.x, point2.y, point2.z)
    );
  }
}

export default ShipMovementAnimation;
