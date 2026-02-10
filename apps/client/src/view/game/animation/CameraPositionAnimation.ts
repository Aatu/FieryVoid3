import * as THREE from "three";
import Animation from "./Animation";
import Vector, { IVector } from "@fieryvoid3/model/src/utils/Vector";
import GameCamera from "../GameCamera";
import { RenderPayload } from "../phase/phaseStrategy/PhaseStrategy";
import { getPointBetween } from "@fieryvoid3/model/src/utils/math";

class CameraPositionAnimation extends Animation {
  protected position: Vector;
  protected lastTime: number | null;
  protected endTime: number;
  protected gameCamera: GameCamera;
  protected startPosition: Vector | null = null;
  protected curve = new THREE.CubicBezierCurve(
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.5, 0.0),
    new THREE.Vector2(0.5, 1),
    new THREE.Vector2(1, 1)
  );

  constructor(
    position: Vector,
    time: number,
    endTime: number,
    gameCamera: GameCamera
  ) {
    super();
    this.time = time;
    this.position = position;
    this.lastTime = null;
    this.endTime = 0;

    this.gameCamera = gameCamera;

    this.duration = 1000;

    if (endTime === undefined) {
      this.endTime = 300;
    }

    this.startPosition = null;
  }

  update(): void {}

  render(payload: RenderPayload) {
    this.smoothMove(payload);
  }

  smoothMove({ total, reverse, paused }: RenderPayload) {
    if (reverse) {
      return;
    }

    if (total > this.time && total < this.time + this.duration && !paused) {
      if (this.startPosition === null) {
        this.startPosition = this.gameCamera.getLookAtPosition();
      }

      const done = 1 - (this.time + this.duration - total) / this.duration;
      const point = this.curve.getPoint(done).y;

      const position = getPointBetween(
        this.startPosition,
        this.position,
        point,
        true
      );

      this.doMove(position);
    } else {
      this.startPosition = null;
    }
  }

  instantMove({ total, reverse }: RenderPayload) {
    if (reverse) {
      return;
    }

    if (
      this.lastTime !== null &&
      this.lastTime < this.time &&
      total > this.time
    ) {
      this.doMove(this.position);
    }

    this.lastTime = total;
  }

  doMove(position: IVector) {
    this.gameCamera.setByLookAtPosition(position);
  }
}

export default CameraPositionAnimation;
