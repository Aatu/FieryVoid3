import Vector from "../../model/utils/Vector";

const a = [
  [0, 0, 0, 0, 0],
  [1 / 4, 0, 0, 0, 0],
  [3 / 32, 9 / 32, 0, 0, 0],
  [1932 / 2197, -7200 / 2197, 7296 / 2197, 0, 0],
  [439 / 216, -8, 3680 / 513, -845 / 4104, 0],
  [-8 / 27, 2, -3544 / 2565, 1859 / 4104, -11 / 40]
];

const bs = [16 / 135, 0, 6656 / 12825, 28561 / 56430, -9 / 50, 2 / 55];

const bsx = [25 / 216, 0, 1408 / 2565, 2197 / 4104, -1 / 5, 0];
const getCacheKey = (stage, arkFunction) => arkFunction + stage;

class ARKStep {
  constructor() {
    this.cache = {};
  }

  derivativeVelocityX(position) {
    const r = this.parentPosition.sub(position);
    return (this.parentMass / Math.pow(r.length(), 3)) * r.x;
  }

  derivativeVelocityY(position) {
    const r = this.parentPosition.sub(position);
    return (this.parentMass / Math.pow(r.length(), 3)) * r.y;
  }

  sum(stage, f) {
    let total = 0;
    for (let i = 0; i < stage; i++) {
      total += a[stage][i] * this.k(i, f);
    }

    return total;
  }

  kx(stage) {
    return dt * (velocity.x + this.sum(stage, "vx"));
  }

  kx(stage) {
    return dt * (velocity.y + sum1(stage, "vy"));
  }

  vx(stage) {
    return (
      dt *
      this.derivativeVelocityX(
        new Vector(
          this.position.x + sum1(stage, "x"),
          this.position.y + sum1(stage, "y")
        )
      )
    );
  }

  kx(stage) {
    return (
      dt *
      this.derivativeVelocityY(
        new Vector(
          this.position.x + sum1(stage, "x"),
          this.position.y + sum1(stage, "y")
        )
      )
    );
  }

  k(stage, f) {
    const cached = this.findCached(stage, f);
    if (cached !== null) {
      console.log("cache hit");
      return cached;
    }

    console.log("cache miss");
    let result = null;

    switch (f) {
      case "x":
        result = this.kx(stage);
        break;
      case "y":
        result = this.ky(stage);
        break;
      case "vx":
        result = this.vx(stage);
        break;
      case "vy":
        result = this.vy(stage);
        break;
    }

    this.cache(stage, f, result);

    return result;
  }

  findCached(stage, f) {
    const key = getCacheKey(stage, f);
    return this.cache[key] !== undefined ? this.cache[key] : null;
  }

  cache(stage, f, result) {
    const key = getCacheKey(stage, f);
    this.cache[key] = result;
  }

  setValues(position, velocity, parentPosition, parentMass, dt) {
    this.position = position;
    this.velocity = velocity;
    this.parentPosition = parentPosition;
    this.parentMass = parentMass;
    this.dt = dt;
    this.cache = {};
    return this;
  }

  calculate(stage, arkFunction) {
    return this.k(stage, arkFunction);
  }
}

export default ARKStep;
