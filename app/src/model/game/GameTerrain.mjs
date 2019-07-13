import GameTerrainEntity from "./GameTerrainEntity.mjs";
import ARK from "../../model/utils/ARK.mjs";

class GameTerrain {
  constructor(gameData) {
    this.gameData = gameData;
    this.entities = [];
    this.ark = new ARK(this);
  }

  getEntities() {
    return this.entities;
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  getGravityVectorForTurn(position, velocity, turn) {
    return this.ark.calculateNewPositionVelocity(position, velocity, turn);
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
