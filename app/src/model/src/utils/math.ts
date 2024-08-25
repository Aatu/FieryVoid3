import { IHexPosition } from "../hexagon";
import { IVector } from "./Vector";

const distance = (a: IVector, b: IVector) => {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.x, 2));
};

const distance3d = (pointA: IVector, pointB: IVector) => {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const dz = pointB.z - pointA.z;

  const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));

  return dist;
};

const getSeededRandomGenerator = (seed: string) => {
  function xmur3(str: string) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }

    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  const seedGenerator = xmur3(seed);

  const xoshiro128ss = (a: number, b: number, c: number, d: number) => {
    return function () {
      var t = b << 9,
        r = a * 5;
      r = ((r << 7) | (r >>> 25)) * 9;
      c ^= a;
      d ^= b;
      b ^= c;
      a ^= d;
      c ^= t;
      d = (d << 11) | (d >>> 21);
      return (r >>> 0) / 4294967296;
    };
  };

  return xoshiro128ss(
    seedGenerator(),
    seedGenerator(),
    seedGenerator(),
    seedGenerator()
  );
};

const addToDirection = (current: number, add: number) => {
  add = add % 360;

  let ret = 0;
  if (current + add > 360) {
    ret = add - (360 - current);
  } else if (current + add < 0) {
    ret = 360 + (current + add);
  } else {
    ret = current + add;
  }

  return ret;
};

const getDistanceBetweenDirections = (
  start: number,
  end: number,
  direction = 1
) => {
  if (end === start) {
    return 0;
  }

  if (direction > 0) {
    if (end < start) {
      return 360 - start + end;
    } else {
      return end - start;
    }
  } else {
    if (end > start) {
      return 360 - end + start;
    } else {
      return start - end;
    }
  }
};

const getPointBetween = (
  start: IVector,
  end: IVector,
  percentage: number,
  noRound: boolean = false
): IVector => {
  var x = start.x + percentage * (end.x - start.x);
  var y = start.y + percentage * (end.y - start.y);

  if (noRound) {
    return { x: x, y: y, z: 0 };
  }

  return { x: Math.floor(x), y: Math.floor(y), z: 0 };
};

const getPointBetween3d = (
  start: IVector,
  end: IVector,
  percentage: number,
  noRound: boolean = false
) => {
  var x = start.x + percentage * (end.x - start.x);
  var y = start.y + percentage * (end.y - start.y);
  var z = start.z + percentage * (end.z - start.z);

  if (noRound) {
    return { x: x, y: y, z: z };
  }

  return { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
};

const getPointBetweenInDistance = (
  start: IVector,
  end: IVector,
  distance: number,
  noRound: boolean = false
) => {
  const totalDistance = distance3d(start, end);
  const percentage = distance / totalDistance;
  return getPointBetween3d(start, end, percentage, noRound);
};

const getDistanceBetweenShipsInHex = (s1: IHexPosition, s2: IHexPosition) => {
  var start = s1.getHexPosition();
  var end = s2.getHexPosition();
  return start.distanceTo(end);
};

const getAngleBetween = (angle1: number, angle2: number, right: boolean) => {
  let difference;
  if (right) {
    if (angle1 > angle2) {
      difference = 360 - angle1 + angle2;
    } else {
      difference = angle2 - angle1;
    }
  } else {
    if (angle1 < angle2) {
      difference = (angle1 + (360 - angle2)) * -1;
    } else {
      difference = angle2 - angle1;
    }
  }

  return difference;
};

const addToHexFacing = (facing: number, add: number) => {
  if (facing + add > 5) {
    return addToHexFacing(0, facing + add - 6);
  }

  if (facing + add < 0) {
    return addToHexFacing(6, facing + add);
  }

  return facing + add;
};

const getPointInDirection = (
  r: number,
  a: number,
  cx: number,
  cy: number,
  noRound: boolean = false
) => {
  a = -a;

  var x = cx + r * Math.cos((a * Math.PI) / 180);
  var y = cy + r * Math.sin((a * Math.PI) / 180);

  if (noRound) {
    return { x: x, y: y };
  }
  return { x: Math.round(x), y: Math.round(y) };
};

const getArcLength = (start: number, end: number) => {
  var a = 0;
  if (start > end) {
    a = 360 - start + end;
  } else {
    a = end - start;
  }

  return a;
};

const isInArc = (direction: number, start: number, end: number) => {
  //direction: 300 start: 360 end: 240
  direction = Math.round(direction);

  if (start === end) return true;

  if ((direction === 0 && start === 360) || (direction === 0 && end === 360))
    return true;

  if (start > end) {
    return direction >= start || direction <= end;
  } else if (direction >= start && direction <= end) {
    return true;
  }

  return false;
};

const radianToDegree = (angle: number) => {
  return angle * (180.0 / Math.PI);
};

const degreeToRadian = (angle: number) => angle / (180.0 / Math.PI);

const getCompassHeadingOfPoint = (observer: IVector, target: IVector) => {
  let heading = radianToDegree(
    Math.atan2(target.y - observer.y, target.x - observer.x)
  );

  if (heading > 0) {
    heading = 360 - heading;
  } else {
    heading = Math.abs(heading);
  }

  return heading;
};

const hexFacingToAngle = (d: number) => {
  switch (d) {
    case 0:
      return 0;
    case 1:
      return 60;
    case 2:
      return 120;
    case 3:
      return 180;
    case 4:
      return 240;
    default:
      return 300;
  }
};

const angleToHexFacing = (d: number) => {
  switch (d) {
    case 0:
      return 0;
    case 60:
      return 1;
    case 120:
      return 2;
    case 180:
      return 3;
    case 240:
      return 4;
    default:
      return 5;
  }
};

const shuffleArray = <T extends unknown[]>(a: T): T => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export {
  distance,
  distance3d,
  getSeededRandomGenerator,
  addToDirection,
  getDistanceBetweenDirections,
  getPointBetween,
  getPointBetween3d,
  getPointBetweenInDistance,
  getDistanceBetweenShipsInHex,
  getAngleBetween,
  addToHexFacing,
  getPointInDirection,
  getArcLength,
  isInArc,
  radianToDegree,
  degreeToRadian,
  getCompassHeadingOfPoint,
  hexFacingToAngle,
  angleToHexFacing,
  shuffleArray,
};
