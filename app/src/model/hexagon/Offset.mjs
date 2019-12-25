import Cube from "./Cube.mjs";

const NEIGHBOURS = [
  [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: 0, r: 1 },
    { q: 1, r: 1 }
  ],
  [
    { q: 1, r: 0 },
    { q: 0, r: -1 },
    { q: -1, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 }
  ]
];

class Offset {
  constructor(q, r) {
    if (q === undefined) {
      console.trace();
    }
    if (q instanceof Offset || (q.q !== undefined && q.r !== undefined)) {
      const offset = q;
      this.q = offset.q;
      this.r = offset.r;
    } else {
      this.q = q;
      this.r = r;
    }
  }

  getNeighbours() {
    var neighbours = [];

    NEIGHBOURS[this.r & 1].forEach(function(neighbour) {
      neighbours.push(this.add(new Offset(neighbour)));
    }, this);

    return neighbours;
  }

  getNeighbourAtHeading(heading) {
    if (heading >= 330 || heading <= 30) {
      return this.add(new Offset(1, 0));
    } else if (heading >= 150 && heading <= 210) {
      return this.add(new Offset(-1, 0));
    } else if (heading > 30 && heading < 90) {
      return this.add(new Offset(1, -1));
    } else if (heading >= 90 && heading < 150) {
      return this.add(new Offset(0, -1));
    } else if (heading > 210 && heading <= 270) {
      return this.add(new Offset(0, 1));
    } else if (heading > 270 && heading < 330) {
      return this.add(new Offset(1, 1));
    }
  }

  add(offset) {
    return this.toCube()
      .add(offset.toCube())
      .toOffset();
  }

  subtract(offset) {
    return this.toCube()
      .subtract(offset.toCube())
      .toOffset();
  }

  scale(scale) {
    return this.toCube()
      .scale(scale)
      .toOffset();
  }

  moveToDirection(direction, steps) {
    return this.toCube()
      .moveToDirection(direction, steps)
      .toOffset();
  }

  equals(offset) {
    return this.q === offset.q && this.r === offset.r;
  }

  getNeighbourAtDirection(direction) {
    var neighbours = this.getNeighbours();

    return neighbours[direction];
  }

  distanceTo(target) {
    return this.toCube().distanceTo(target.toCube());
  }

  ring(radius) {
    return this.toCube()
      .ring(radius)
      .map(cube => cube.toOffset());
  }

  spiral(radius) {
    return this.toCube()
      .spiral(radius)
      .map(cube => cube.toOffset());
  }

  clone() {
    return new Offset(this);
  }

  toCube() {
    const x = this.q - (this.r + (this.r & 1)) / 2;
    const z = this.r;
    const y = -x - z;

    /*
        var x, y, z;
        switch (this.layout) {
            case Offset.ODD_R:
                x = this.q - (this.r - (this.r & 1)) / 2;
                z = this.r;
                y = -x - z;
                break;
            case Offset.EVEN_R:
                x = this.q - (this.r + (this.r&1)) / 2;
                z = this.r;
                y = -x - z;
                break;
        }
        */

    return new Cube(x, y, z).round();
  }

  drawLine(target, distance) {
    return this.toCube()
      .drawLine(target.toCube(), distance)
      .map(cube => cube.toOffset());
  }

  toString() {
    return `(${this.q}, ${this.r})`;
  }

  rotate(facing) {
    return this.toCube()
      .rotate(facing)
      .toOffset();
  }

  normalize() {
    return this.toCube()
      .normalize()
      .toOffset();
  }
}

export default Offset;
