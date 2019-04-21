import Cube from "./Cube";

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
}

export default Offset;
