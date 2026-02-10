import { getSeededRandomGenerator } from "@fieryvoid3/model/src/utils/math";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";
import * as THREE from "three";

const getRandomPosition = (
  maxDistance: number,
  getRandom: () => number
): IVector => ({
  x: getRandom() * maxDistance - maxDistance / 2,
  y: getRandom() * maxDistance - maxDistance / 2,
  z: 0,
});

const constructFirstCurve = (nextPosition: IVector) => {
  return new THREE.CubicBezierCurve(
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0, 0),
    new THREE.Vector2(nextPosition.x * -1, nextPosition.y * -1),
    new THREE.Vector2(0, 0)
  );
};

const constructEvasionCurve = (
  currentPosition: IVector,
  nextPosition: IVector
) => {
  return new THREE.CubicBezierCurve(
    new THREE.Vector2(0, 0),
    new THREE.Vector2(currentPosition.x, currentPosition.y),
    new THREE.Vector2(nextPosition.x * -1, nextPosition.y * -1),
    new THREE.Vector2(0, 0)
  );
};

const constructEvasionCurves = (
  evasion: number,
  maxDistance: number,
  getRandom: () => number
) => {
  const curves = [];

  if (evasion === 0) {
    return [];
  }

  const positions = new Array(evasion + 1)
    .fill(0)
    .map(() => getRandomPosition(maxDistance, getRandom));

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const nextPosition: IVector =
      i === positions.length - 1 ? { x: 0, y: 0, z: 0 } : positions[i + 1];

    if (i === 0) {
      curves.push(constructFirstCurve(nextPosition));
    } else {
      curves.push(constructEvasionCurve(position, nextPosition));
    }
  }

  return curves;
};

class ShipEvasionMovementPath {
  private evasion: number;
  private curves: THREE.CubicBezierCurve[];

  constructor(seed: string, evasion: number) {
    this.evasion = evasion;

    this.curves = constructEvasionCurves(
      this.evasion,
      100 / this.evasion,
      getSeededRandomGenerator(seed)
    );
  }

  getOffset(percent: number) {
    if (this.evasion === 0) {
      return { x: 0, y: 0 };
    }

    const point = (this.curves.length - 1) * percent;
    const curveNumber = Math.floor(point);
    const decimal = point - Math.floor(point);

    const curve = this.curves[curveNumber];
    return curve.getPoint(decimal);
  }
}

export default ShipEvasionMovementPath;
