import Offset from "./Offset.mjs";

const PRECISION = 4;

const lerp = (a, b, t) => {
  return a + (b - a) * t;
};

const cubeLerp = (a, b, t) => {
  return new Cube(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
};

class Cube {
  constructor(x, y, z) {
    if (
      x instanceof Cube ||
      (x.x !== undefined && x.y !== undefined && x.z !== undefined)
    ) {
      const cube = x;
      this.x = this._formatNumber(cube.x);
      this.y = this._formatNumber(cube.y);
      this.z = this._formatNumber(cube.z);
    } else {
      this.x = this._formatNumber(x);
      this.y = this._formatNumber(y);
      this.z = this._formatNumber(z);
    }

    this.neighbours = [
      { x: 1, y: -1, z: 0 },
      { x: 1, y: 0, z: -1 },
      { x: 0, y: 1, z: -1 },
      { x: -1, y: 1, z: 0 },
      { x: -1, y: 0, z: 1 },
      { x: 0, y: -1, z: 1 }
    ];

    this._validate();
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

  _validate() {
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
    var neighbours = [];

    this.neighbours.forEach(function(neighbour) {
      neighbours.push(this.add(new Cube(neighbour)));
    }, this);

    return neighbours;
  }

  moveToDirection(direction, steps = 1) {
    return this.add(new Cube(this.neighbours[direction]).scale(steps));
  }

  add(cube) {
    return new Cube(this.x + cube.x, this.y + cube.y, this.z + cube.z);
  }

  subtract(cube) {
    return new Cube(this.x - cube.x, this.y - cube.y, this.z - cube.z);
  }

  scale(scale) {
    return new Cube(this.x * scale, this.y * scale, this.z * scale);
  }

  distanceTo(cube) {
    return Math.max(
      Math.abs(this.x - cube.x),
      Math.abs(this.y - cube.y),
      Math.abs(this.z - cube.z)
    );
  }

  equals(cube) {
    return this.x === cube.x && this.y === cube.y && this.z === cube.z;
  }

  clone() {
    return new Cube(this);
  }

  getFacing(neighbour) {
    var index = -1;

    var delta = neighbour.subtract(this);

    this.neighbours.some(function(hex, i) {
      if (delta.equals(hex)) {
        index = i;
        return true;
      }

      return false;
    });

    return index;
  }

  ring(radius) {
    const results = [];

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

  spiral(radius) {
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

  _formatNumber(number) {
    return parseFloat(number.toFixed(PRECISION));
  }

  normalize() {
    return this.drawLine(new Cube(0, 0, 0), 1)[0];
  }

  drawLine(target, distance = null) {
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

  rotate(facing) {
    let result = this;

    const takeStep = cube => {
      return new Cube(-cube.y, -cube.z, -cube.x);
    };

    while (facing--) {
      result = takeStep(result);
    }

    return result;
  }
}

export default Cube;
