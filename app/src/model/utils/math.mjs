import hexagon from "../hexagon";

const distance = (x1, y1, x2, y2) => {
  if (y1.x !== undefined && x1.x !== undefined) {
    x2 = y1.x;
    y2 = y1.y;
    y1 = x1.y;
    x1 = x1.x;
  }

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const distance3d = (pointA, pointB) => {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const dz = pointB.z - pointA.z;

  const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));

  return dist;
};

const getSeededRandomGenerator = seed => {
  function lcg(a) {
    return (a * 48271) % 2147483647;
  }
  seed = seed ? lcg(seed) : lcg(Math.random());
  return function() {
    return (seed = lcg(seed)) / 2147483648;
  };
};

const addToDirection = (current, add) => {
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

const getDistanceBetweenDirections = (start, end, direction = 1) => {
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

const getPointBetween = (start, end, percentage, noRound) => {
  var x = start.x + percentage * (end.x - start.x);
  var y = start.y + percentage * (end.y - start.y);

  if (noRound) {
    return { x: x, y: y };
  }

  return { x: Math.floor(x), y: Math.floor(y) };
};

const getPointBetween3d = (start, end, percentage, noRound) => {
  var x = start.x + percentage * (end.x - start.x);
  var y = start.y + percentage * (end.y - start.y);
  var z = start.z + percentage * (end.z - start.z);

  if (noRound) {
    return { x: x, y: y, z: z };
  }

  return { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
};

const getPointBetweenInDistance = (start, end, distance, noRound) => {
  const totalDistance = distance3d(start, end);
  const percentage = distance / totalDistance;
  return getPointBetween3d(start, end, percentage, noRound);
};

const getDistanceBetweenShipsInHex = (s1, s2) => {
  var start = s1.getHexPosition();
  var end = s2.getHexPosition();
  return start.distanceTo(end);
};

const getAngleBetween = (angle1, angle2, right) => {
  //console.log(angle1  + " " + angle2);

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

const addToHexFacing = (facing, add) => {
  if (facing + add > 5) {
    return addToHexFacing(0, facing + add - 6);
  }

  if (facing + add < 0) {
    return addToHexFacing(6, facing + add);
  }

  return facing + add;
};

const getPointInDirection = (r, a, cx, cy, noRound) => {
  a = -a;

  var x = cx + r * Math.cos((a * Math.PI) / 180);
  var y = cy + r * Math.sin((a * Math.PI) / 180);

  if (noRound) {
    return { x: x, y: y };
  }
  return { x: Math.round(x), y: Math.round(y) };
};

const getArcLength = (start, end) => {
  var a = 0;
  if (start > end) {
    a = 360 - start + end;
  } else {
    a = end - start;
  }

  return a;
};

const isInArc = (direction, start, end) => {
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

const radianToDegree = angle => {
  return angle * (180.0 / Math.PI);
};

const degreeToRadian = angle => angle / (180.0 / Math.PI);

const getCompassHeadingOfShip = (observer, target) => {
  throw new Error("This should not be here");
  /*
    var oPos = shipManager.getShipPosition(observer);
    var tPos = shipManager.getShipPosition(target);

    if (oPos.equals(tPos)) {
      if (shipManager.hasBetterInitive(observer, target)) {
        oPos = shipManager.movement.getPreviousLocation(observer);
      } else {
        tPos = shipManager.movement.getPreviousLocation(target);
      }
    }

    oPos = window.coordinateConverter.fromHexToGame(oPos);
    tPos = window.coordinateConverter.fromHexToGame(tPos);

    return mathlib.getCompassHeadingOfPoint(oPos, tPos);
    */
};

const getCompassHeadingOfPoint = (observer, target) => {
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

const hexFacingToAngle = d => {
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
  getCompassHeadingOfShip,
  getCompassHeadingOfPoint,
  hexFacingToAngle
};
