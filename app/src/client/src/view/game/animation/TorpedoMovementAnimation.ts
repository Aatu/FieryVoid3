import * as THREE from "three";
import Animation from "./Animation";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import {
  getCompassHeadingOfPoint,
  getSeededRandomGenerator,
} from "@fieryvoid3/model/src/utils/math";
import TorpedoObject from "../renderer/ships/TorpedoObject";
import { RenderPayload } from "../phase/phaseStrategy/PhaseStrategy";

class TorpedoMovementAnimation extends Animation {
  private icon: TorpedoObject;
  private startTime: number;
  private end: number;
  private startPosition: Vector;
  private endPosition: Vector;
  private interceptTime: number | null;
  private launch: boolean;
  private impact: boolean;
  private positionCurve: THREE.CubicBezierCurve3 | THREE.LineCurve3;
  private variance: Vector;

  constructor(
    icon: TorpedoObject,
    startPosition: Vector,
    endPosition: Vector,
    startTime: number,
    end: number,
    launch: boolean = false,
    interceptTime: number | null = null,
    impact: boolean = false
  ) {
    super();

    this.icon = icon;

    this.startTime = startTime;
    this.end = end;
    this.duration = end - startTime;

    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.interceptTime = interceptTime;

    this.launch = launch;
    this.impact = impact;

    this.positionCurve = this.buildPositionCurve(startPosition, endPosition);

    const getRandom = getSeededRandomGenerator(icon.torpedoFlight.id);
    this.variance = new Vector(getRandom() * 30 - 15, getRandom() * 30 - 15);
  }

  getVariation() {
    return this.variance;
  }

  deactivate() {
    this.icon.hide();
  }

  update() {}

  cleanUp() {}

  getPositionAt(time: number) {
    const turnDone = this.getMovementTurnDone(time);

    if (turnDone === -1) {
      throw new Error("Don't ask ShipVelocityAnimation");
    }

    const percentDone = turnDone < 1 ? turnDone % 1 : 1;

    return {
      facing: 0, //this.endMove.facing,
      position: this.positionCurve.getPoint(percentDone),
    };
  }

  getInterceptPosition(): Vector | null {
    if (this.interceptTime === null) {
      return null;
    }

    const turnDone = this.getMovementTurnDone(this.interceptTime);

    const percentDone = turnDone < 1 ? turnDone % 1 : 1;
    const position = this.positionCurve.getPoint(percentDone);

    return new Vector(position).add(this.variance);
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

  render({ total }: RenderPayload) {
    const turnDone = this.getMovementTurnDone(total);

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

  buildPositionCurve(start: Vector, end: Vector) {
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
