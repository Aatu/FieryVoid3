import * as THREE from "three";
import Animation from "../Animation";
import ShipEvasionMovementPath from "./ShipEvasionMovementPath";
import PivotSteps from "./PivotSteps";

class ShipMovementAnimation extends Animation {
  constructor(shipIcon, moves) {
    super();

    console.log("ShipMovementAnimation, moves", moves);
    this.shipIcon = shipIcon;
    this.moves = moves;

    this.doneCallback = null;

    this.duration = 5000;
    this.time = this.time;

    this.positionCurves = this.movesToCurves(moves);
    this.pivotSteps = new PivotSteps(moves);

    /*

    this.positionCurve = this.buildPositionCurve();
    this.rotations = this.buildRotations();
    this.evasionOffset = new ShipEvasionMovementPath(
      this.turn * this.ship.id,
      this.movementService.getEvasion(this.ship)
    );

    this.easeInOut = new THREE.CubicBezierCurve(
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.75, 0),
      new THREE.Vector2(0.25, 1),
      new THREE.Vector2(1, 1)
    );

    /*
    this.turnCurve = new THREE.CubicBezierCurve(
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.25, 0.25),
      new THREE.Vector2(0.75, 0.75),
      new THREE.Vector2(1, 1)
    );

    */

    Animation.call(this);
  }

  deactivate() {}

  update(gameData) {}

  cleanUp() {}

  render({ turn, percentDone }) {
    const position = this.positionCurves[turn]
      ? this.positionCurves[turn].getPoint(percentDone)
      : this.positionCurves[this.positionCurves.length - 1].getPoint(1);

    this.shipIcon.setPosition(position);
    this.shipIcon.setFacing(-this.pivotSteps.getFacing(turn, percentDone));
  }

  movesToCurves(moves) {
    const startsAndEnds = [];
    let start = null;

    moves.forEach(move => {
      if (move.isDeploy()) {
        start = move;
      } else if (move.isEnd() && !start) {
        start = move;
      } else if (move.isEnd()) {
        startsAndEnds.push({
          start: start,
          end: move
        });

        start = move;
      }
    });

    const curves = startsAndEnds.map(({ start, end }) =>
      this.buildPositionCurve(start, end)
    );

    return curves;
  }

  buildPositionCurve(start, end) {
    const point1 = start.position.roundToHexCenter();
    const control1 = start.position.add(start.velocity.multiplyScalar(0.5));
    const control2 = end.position.sub(end.velocity.multiplyScalar(0.5));
    const point2 = end.position.roundToHexCenter();

    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(point1.x, point1.y, point1.z),
      new THREE.Vector3(control1.x, control1.y, control1.z),
      new THREE.Vector3(point2.x, point2.y, point2.z)
    );
    /*
    return new THREE.CubicBezierCurve3(
      new THREE.Vector3(point1.x, point1.y, point1.z),
      new THREE.Vector3(control1.x, control1.y, control1.z),
      new THREE.Vector3(control2.x, control2.y, control2.z),
      new THREE.Vector3(point2.x, point2.y, point2.z)
    );
    */
  }
}

export default ShipMovementAnimation;
