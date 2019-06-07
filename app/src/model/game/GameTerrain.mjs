import GameTerrainEntity from "./GameTerrainEntity.mjs";
import hexagon from "../../model/hexagon";
import THREE from "three";

class GameTerrain {
  constructor(gameData) {
    this.gameData = gameData;
    this.entities = [];
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  getGravityVector(start, end, coordinateConverter) {
    let vector = new THREE.Vector3();
    this.entities.forEach(entity => {
      const entityVector = entity.getGravityVector(
        start,
        end,
        coordinateConverter
      );

      vector = vector.add(entityVector);
    });
    return vector;
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
