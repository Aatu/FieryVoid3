import * as THREE from "three";
import Animation from "./Animation";
import ShipObject from "../renderer/ships/ShipObject";
import { MovementOrder } from "@fieryvoid3/model/src/movement";
import { RenderPayload } from "../phase/phaseStrategy/PhaseStrategy";
import { hexFacingToAngle } from "@fieryvoid3/model/src/utils/math";
import Vector from "@fieryvoid3/model/src/utils/Vector";

class ShipVelocityAnimation extends Animation {
  private shipIcon: ShipObject;
  private endMove: MovementOrder;
  private startTime: number;
  private end: number;
  private positionCurve: THREE.CubicBezierCurve3;

  constructor(
    shipIcon: ShipObject,
    endMove: MovementOrder,
    start: number,
    end: number
  ) {
    super();

    this.shipIcon = shipIcon;
    this.endMove = endMove;

    this.startTime = start;
    this.end = end;

    this.duration = end - start;

    this.positionCurve = this.buildPositionCurve(
      endMove.position,
      endMove.position.add(endMove.velocity)
    );
  }

  deactivate() {}

  update() {}

  cleanUp() {}

  getPositionAt(time: number) {
    const turnDone = this.getMovementTurnDone(time);

    if (turnDone === -1) {
      throw new Error("Don't ask ShipVelocityAnimation");
    }

    const percentDone = turnDone < 1 ? turnDone % 1 : 1;

    return {
      facing: this.endMove.facing,
      position: this.positionCurve.getPoint(percentDone),
    };
  }

  getMovementTurnDone(total: number) {
    if (total < this.startTime) {
      return -1;
    }

    if (total > this.end) {
      return 1;
    }
    const time = total - this.startTime;
    return time / this.duration;
  }

  render(payload: RenderPayload) {
    const turnDone = this.getMovementTurnDone(payload.total);

    if (turnDone === -1) {
      return;
    }

    const percentDone = turnDone < 1 ? turnDone % 1 : 1;
    this.shipIcon.setPosition(this.positionCurve.getPoint(percentDone));
    this.shipIcon.setFacing(-hexFacingToAngle(this.endMove.facing));
  }

  buildPositionCurve(start: Vector, end: Vector) {
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
