import GameTerrainEntity from "./GameTerrainEntity.mjs";
import hexagon from "../../model/hexagon";
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

const derivativeVelocityX = (position, parentPosition, parentMass) => {
  const r = parentPosition.sub(position);
  console.log("derivativeVelocityX", position, parentPosition, parentMass);
  const result = (parentMass / Math.pow(r.length(), 3)) * r.x;
  console.log(result);
  return result;
};

window.derivativeVelocityX = derivativeVelocityX;

const derivativeVelocityY = (position, parentPosition, parentMass) => {
  console.log("derivativeVelocityY", position, parentPosition, parentMass);
  const r = parentPosition.sub(position);
  const result = (parentMass / Math.pow(r.length(), 3)) * r.y;
  console.log(result);
  return result;
};

window.derivativeVelocityY = derivativeVelocityY;

const sum1 = (stage, f, position, velocity, parentPosition, parentMass, dt) => {
  let total = 0;
  for (let i = 0; i < stage; i++) {
    //console.log("sum1 for loop, stage", stage, "i", i);
    total +=
      a[stage][i] * k(i, f, position, velocity, parentPosition, parentMass, dt);
  }

  //console.log("sum returns", total);
  return total;
};

const k = (stage, f, position, velocity, parentPosition, parentMass, dt) => {
  console.log("K, stage", stage, "f", f);

  let result = 0;

  switch (f) {
    case "x":
      result =
        dt *
        (velocity.x +
          sum1(
            stage,
            "vx",
            position,
            velocity,
            parentPosition,
            parentMass,
            dt
          ));
      break;
    case "y":
      result =
        dt *
        (velocity.y +
          sum1(
            stage,
            "vy",
            position,
            velocity,
            parentPosition,
            parentMass,
            dt
          ));
      break;
    case "vx":
      result =
        dt *
        derivativeVelocityX(
          new Vector(
            position.x +
              sum1(
                stage,
                "x",
                position,
                velocity,
                parentPosition,
                parentMass,
                dt
              ),
            position.y +
              sum1(
                stage,
                "y",
                position,
                velocity,
                parentPosition,
                parentMass,
                dt
              )
          ),
          parentPosition,
          parentMass
        );
      break;
    case "vy":
      result =
        dt *
        derivativeVelocityY(
          new Vector(
            position.x +
              sum1(
                stage,
                "x",
                position,
                velocity,
                parentPosition,
                parentMass,
                dt
              ),
            position.y +
              sum1(
                stage,
                "y",
                position,
                velocity,
                parentPosition,
                parentMass,
                dt
              )
          ),
          parentPosition,
          parentMass
        );
      break;
  }

  console.log("K returns", result);
  return result;
};

window.k = k;

class GameTerrain {
  constructor(gameData) {
    this.gameData = gameData;
    this.entities = [];
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  ARK(position, velocity) {
    return { position, velocity };
  }

  ARKStep() {}

  getGravityVectorForTurn(position, velocity, turn) {
    let time = 0;
    let iterations = 10000;
    const dt = 1 / iterations;

    while (iterations--) {
      time = 1 - dt * iterations;

      const parentEntity = this.getParentEntity(position, time, turn);

      position = position.add(velocity.multiplyScalar(dt));
      velocity = parentEntity
        ? velocity.add(
            parentEntity.getGravityVector(position).multiplyScalar(dt)
          )
        : velocity;
    }

    return { position: position.clone(), velocity: velocity.clone() };
  }

  getParentEntity(position, time, turn) {
    return this.entities[0];
  }

  serialize() {
    return this.entities.map(entity => entity.serialize());
  }

  deserialize(data = []) {
    this.entities = data.map(entry => new GameTerrainEntity(entry));

    return this;
  }
}

export default GameTerrain;
