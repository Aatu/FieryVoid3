/*
import Vector from "./Vector";
import THREE from "three";

const a = [
  [0, 0, 0, 0, 0],
  [1 / 4, 0, 0, 0, 0],
  [3 / 32, 9 / 32, 0, 0, 0],
  [1932 / 2197, -7200 / 2197, 7296 / 2197, 0, 0],
  [439 / 216, -8, 3680 / 513, -845 / 4104, 0],
  [-8 / 27, 2, -3544 / 2565, 1859 / 4104, -11 / 40],
];

const bs = [16 / 135, 0, 6656 / 12825, 28561 / 56430, -9 / 50, 2 / 55];

const bsx = [25 / 216, 0, 1408 / 2565, 2197 / 4104, -1 / 5, 0];

const getCacheKey = (stage, arkFunction) => arkFunction + stage;

class ARKStep {
  constructor(position, velocity, parentPosition, parentMass, dt) {
    this.setValues(position, velocity, parentPosition, parentMass, dt);
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
    return this.dt * (this.velocity.x + this.sum(stage, "vx"));
  }

  ky(stage) {
    return this.dt * (this.velocity.y + this.sum(stage, "vy"));
  }

  kvx(stage) {
    return (
      this.dt *
      this.derivativeVelocityX(
        new Vector(
          this.position.x + this.sum(stage, "x"),
          this.position.y + this.sum(stage, "y")
        )
      )
    );
  }

  kvy(stage) {
    return (
      this.dt *
      this.derivativeVelocityY(
        new Vector(
          this.position.x + this.sum(stage, "x"),
          this.position.y + this.sum(stage, "y")
        )
      )
    );
  }

  k(stage, f) {
    const cached = this.findCached(stage, f);
    if (cached !== null) {
      this.cacheHit++;
      return cached;
    }

    this.cacheMiss++;
    let result = null;

    switch (f) {
      case "x":
        result = this.kx(stage);
        break;
      case "y":
        result = this.ky(stage);
        break;
      case "vx":
        result = this.kvx(stage);
        break;
      case "vy":
        result = this.kvy(stage);
        break;
    }

    this.setCache(stage, f, result);

    return result;
  }

  findCached(stage, f) {
    const key = getCacheKey(stage, f);
    return this.cache[key] !== undefined ? this.cache[key] : null;
  }

  setCache(stage, f, result) {
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
    this.cacheHit = 0;
    this.cacheMiss = 0;
    return this;
  }

  getAllKs(f) {
    const result = [];
    for (let i = 0; i < 6; i++) {
      result[i] = this.k(i, f);
    }

    return result;
  }

  weightedSum(values, k) {
    return values
      .map((value, i) => value * k[i])
      .reduce((accumulator, current) => accumulator + current, 0);
  }

  subVectors(a, b) {
    return a.map((valueA, i) => valueA - b[i]);
  }

  calculate() {
    const ks = {
      x: this.getAllKs("x"),
      y: this.getAllKs("y"),
      vx: this.getAllKs("vx"),
      vy: this.getAllKs("vy"),
    };

    const dPosition = new Vector(
      this.weightedSum(bs, ks.x),
      this.weightedSum(bs, ks.y)
    );

    const dVelocity = new Vector(
      this.weightedSum(bs, ks.vx),
      this.weightedSum(bs, ks.vy)
    );

    const error = new THREE.Vector4(
      this.weightedSum(this.subVectors(bs, bsx), ks.x),
      this.weightedSum(this.subVectors(bs, bsx), ks.y),
      this.weightedSum(this.subVectors(bs, bsx), ks.vx),
      this.weightedSum(this.subVectors(bs, bsx), ks.vy)
    ).length();

    return { dPosition, dVelocity, error };
  }

  reportCache() {
    console.log(
      "total:",
      this.cacheHit + this.cacheMiss,
      "hit ratio:",
      this.cacheHit / (this.cacheHit + this.cacheMiss),
      "hit:",
      this.cacheHit,
      "miss:",
      this.cacheMiss
    );
  }
}

export default ARKStep;
*/
