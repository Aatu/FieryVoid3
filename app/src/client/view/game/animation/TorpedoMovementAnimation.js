import * as THREE from "three";
import Animation from "./Animation";
import { hexFacingToAngle } from "../../../../model/utils/math";
import { getCompassHeadingOfPoint } from "../../../../model/utils/math";
import Vector from "../../../../model/utils/Vector";
import { getSeededRandomGenerator } from "../../../../model/utils/math";

class TorpedoMovementAnimation extends Animation {
  constructor(
    icon,
    startPosition,
    endPosition,
    start,
    end,
    launch = false,
    interceptTime = null,
    impact = false
  ) {
    super();

    this.icon = icon;

    this.start = start;
    this.end = end;
    this.duration = end - start;

    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.interceptTime = interceptTime;

    this.launch = launch;
    this.impact = impact;

    this.positionCurve = this.buildPositionCurve(startPosition, endPosition);

    const getRandom = getSeededRandomGenerator(icon.torpedoFlight.id);
    this.variance = new Vector(getRandom() * 30 - 15, getRandom() * 30 - 15);

    Animation.call(this);
  }

  deactivate() {
    this.icon.hide();
  }

  update(gameData) {}

  cleanUp() {}

  getPositionAt(time) {
    const turnDone = this.getMovementTurnDone({ total: time });

    if (turnDone === -1) {
      throw new Error("Don't ask ShipVelocityAnimation");
    }

    const percentDone = turnDone < 1 ? turnDone % 1 : 1;

    return {
      facing: this.endMove.facing,
      position: this.positionCurve.getPoint(percentDone),
    };
  }

  getInterceptPosition() {
    const turnDone = this.getMovementTurnDone({ total: this.interceptTime });

    const percentDone = turnDone < 1 ? turnDone % 1 : 1;
    const position = this.positionCurve.getPoint(percentDone);

    return new Vector(position);
  }

  getMovementTurnDone({ total }) {
    if (total < this.start) {
      return 0;
    }

    if (total > this.end) {
      return 1;
    }
    const time = total - this.start;
    return time / this.duration;
  }

  render({ total }) {
    const turnDone = this.getMovementTurnDone({ total });

    if (this.interceptTime !== null && total > this.interceptTime) {
      this.icon.hide();
      return;
    }

    if (turnDone === 0 && this.launch) {
      this.icon.hide();
      return;
    }

    const percentDone = turnDone < 1 ? turnDone % 1 : 1;

    if (turnDone === 1 && this.impact) {
      this.icon.hide();
      return;
    }

    this.icon.show();
    const position = this.positionCurve.getPoint(percentDone);

    this.icon.setPosition({
      x: position.x + this.variance.x,
      y: position.y + this.variance.y,
      z: position.z,
    });
    this.icon.setFacing(
      -getCompassHeadingOfPoint(this.startPosition, this.endPosition)
    );
  }

  buildPositionCurve(start, end) {
    /*
    const point1 = start.roundToHexCenter();
    const control1 = start.roundToHexCenter();
    const control2 = end.roundToHexCenter();
    const point2 = end.roundToHexCenter();
    */

    const point1 = start;
    const control1 = start;
    const control2 = end;
    const point2 = end;

    if (!this.impact) {
      return new THREE.CubicBezierCurve3(
        new THREE.Vector3(point1.x, point1.y, point1.z),
        new THREE.Vector3(control1.x, control1.y, control1.z),
        new THREE.Vector3(control2.x, control2.y, control2.z),
        new THREE.Vector3(point2.x, point2.y, point2.z)
      );
    }

    return new THREE.LineCurve3(
      new THREE.Vector3(point1.x, point1.y, point1.z),
      new THREE.Vector3(point2.x, point2.y, point2.z)
    );
  }
}

export default TorpedoMovementAnimation;
