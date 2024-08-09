import { isIVector, IVector } from "../utils/Vector";
import Offset from "./Offset.js";

const PRECISION = 4;

const NEIGHBOURS: IVector[] = [
  { x: 1, y: -1, z: 0 },
  { x: 1, y: 0, z: -1 },
  { x: 0, y: 1, z: -1 },
  { x: -1, y: 1, z: 0 },
  { x: -1, y: 0, z: 1 },
  { x: 0, y: -1, z: 1 },
];

const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t;
};

const cubeLerp = (a: IVector, b: IVector, t: number) => {
  return new Cube(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
};

class Cube {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: Cube | IVector | number, y: number = 0, z: number = 0) {
    if (x instanceof Cube || isIVector(x)) {
      const cube = x;
      this.x = this.formatNumber(cube.x);
      this.y = this.formatNumber(cube.y);
      this.z = this.formatNumber(cube.z);
    } else {
      this.x = this.formatNumber(x);
      this.y = this.formatNumber(y);
      this.z = this.formatNumber(z);
    }

    this.validate();
  }

  round() {
    if (this.x % 1 === 0 && this.y % 1 === 0 && this.z % 1 === 0) {
      return this;
    }

    var rx = Math.round(this.x);
    var ry = Math.round(this.y);
    var rz = Math.round(this.z);

    var x_diff = Math.abs(rx - this.x);
    var y_diff = Math.abs(ry - this.y);
    var z_diff = Math.abs(rz - this.z);

    if (x_diff > y_diff && x_diff > z_diff) {
      rx = -ry - rz;
    } else if (y_diff > z_diff) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }

    return new Cube(rx, ry, rz);
  }

  private validate() {
    if (Math.abs(this.x + this.y + this.z) > 0.001) {
      throw new Error(
        "Invalid Cube coordinates: (" +
          this.x +
          ", " +
          this.y +
          ", " +
          this.z +
          ")"
      );
    }
  }

  getNeighbours() {
    const neighbours: Cube[] = [];

    NEIGHBOURS.forEach((neighbour) => {
      neighbours.push(this.add(new Cube(neighbour)));
    });

    return neighbours;
  }

  moveToDirection(direction: number, steps: number = 1) {
    return this.add(new Cube(NEIGHBOURS[direction]).scale(steps));
  }

  add(cube: Cube) {
    return new Cube(this.x + cube.x, this.y + cube.y, this.z + cube.z);
  }

  subtract(cube: Cube) {
    return new Cube(this.x - cube.x, this.y - cube.y, this.z - cube.z);
  }

  scale(scale: number) {
    return new Cube(this.x * scale, this.y * scale, this.z * scale);
  }

  distanceTo(cube: Cube) {
    return Math.max(
      Math.abs(this.x - cube.x),
      Math.abs(this.y - cube.y),
      Math.abs(this.z - cube.z)
    );
  }

  equals(cube: Cube | IVector) {
    return this.x === cube.x && this.y === cube.y && this.z === cube.z;
  }

  clone() {
    return new Cube(this);
  }

  getFacing(neighbour: Cube) {
    var index = -1;

    var delta = neighbour.subtract(this);

    NEIGHBOURS.some(function (hex, i) {
      if (delta.equals(hex)) {
        index = i;
        return true;
      }

      return false;
    });

    return index;
  }

  ring(radius: number) {
    const results: Cube[] = [];

    if (radius === 0) {
      return results;
    }

    let cube = this.moveToDirection(4, radius);
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < radius; j++) {
        results.push(cube);
        cube = cube.moveToDirection(i);
      }
    }

    return results;
  }

  spiral(radius: number) {
    let results = [this.clone()];
    for (let k = 1; k <= radius; k++) {
      results = results.concat(this.ring(k));
    }
    return results;
  }

  toOffset() {
    var q = this.x + (this.z + (this.z & 1)) / 2;
    var r = this.z;

    return new Offset(q, r); //EVEN_R
  }

  /*
        Cube.prototype.toOffset = function()
        {
            var q = this.x + (this.z - (this.z & 1)) / 2;
            var r = this.z;
    
            return new hexagon.Offset(q, r); //ODD_R
        };
    */
  toString() {
    return "(" + this.x + "," + this.y + "," + this.z + ")";
  }

  private formatNumber(number: number) {
    return parseFloat(number.toFixed(PRECISION));
  }

  normalize() {
    return this.drawLine(new Cube(0, 0, 0), 1)[0];
  }

  drawLine(target: Cube, distance: number | null = null) {
    const n = this.distanceTo(target);

    if (distance === null) {
      distance = n;
    }

    const results = [];
    for (let i = distance; i >= 0; i--) {
      results.push(cubeLerp(target, this, (1.0 / n) * i).round());
    }

    return results;
  }

  rotate(facing: number) {
    let result: Cube = this;

    const takeStep = (cube: Cube) => {
      return new Cube(-cube.y, -cube.z, -cube.x);
    };

    while (facing--) {
      result = takeStep(result);
    }

    return result;
  }
}

export default Cube;
