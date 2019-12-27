import * as THREE from "three";
import Animation from "./Animation";
import { hexFacingToAngle } from "../../../../model/utils/math.mjs";

class ShipVelocityAnimation extends Animation {
  constructor(shipIcon, endMove, start, end) {
    super();

    this.shipIcon = shipIcon;
    this.endMove = endMove;

    this.start = start;
    this.end = end;

    this.duration = end - start;

    this.positionCurve = this.buildPositionCurve(
      endMove.position,
      endMove.position.add(endMove.velocity)
    );

    Animation.call(this);
  }

  deactivate() {}

  update(gameData) {}

  cleanUp() {}

  getMovementTurnDone({ total }) {
    if (total < this.start) {
      return -1;
    }

    if (total > this.end) {
      return 1;
    }
    const time = total - this.start;
    return time / this.duration;
  }

  render(payload) {
    const turnDone = this.getMovementTurnDone(payload);

    if (turnDone === -1) {
      return;
    }

    const percentDone = turnDone < 1 ? turnDone % 1 : 1;
    this.shipIcon.setPosition(this.positionCurve.getPoint(percentDone));
    this.shipIcon.setFacing(-hexFacingToAngle(this.endMove.facing));
  }

  buildPositionCurve(start, end) {
    const point1 = start.roundToHexCenter();
    const control1 = start.roundToHexCenter();
    const control2 = end.roundToHexCenter();
    const point2 = end.roundToHexCenter();

    return new THREE.CubicBezierCurve3(
      new THREE.Vector3(point1.x, point1.y, point1.z),
      new THREE.Vector3(control1.x, control1.y, control1.z),
      new THREE.Vector3(control2.x, control2.y, control2.z),
      new THREE.Vector3(point2.x, point2.y, point2.z)
    );
  }
}

export default ShipVelocityAnimation;
