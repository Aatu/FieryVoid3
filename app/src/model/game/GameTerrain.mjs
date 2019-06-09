import GameTerrainEntity from "./GameTerrainEntity.mjs";
import hexagon from "../../model/hexagon";
import Vector from "../../model/utils/Vector";

class GameTerrain {
  constructor(gameData) {
    this.gameData = gameData;
    this.entities = [];
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  getGravityVectorForTurn2(position, velocity) {
    position = position.clone();
    velocity = velocity.clone();
    let time = 0;
    let iterations = 100;
    const dt = 1 / iterations;

    while (iterations--) {
      time = 1 - dt * iterations;

      const parentEntity = this.getParentEntity(position, time);
      const gravityVector = parentEntity.getGravityVector(position);

      position = position.clone().add(velocity.clone().multiplyScalar(dt));
      velocity = velocity.clone().add(gravityVector.clone().multiplyScalar(dt));
    }

    return { position, velocity };
  }

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
