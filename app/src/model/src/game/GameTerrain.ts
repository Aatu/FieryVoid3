import GameTerrainEntity, {
  SerializedGameTerrainEntity,
} from "./GameTerrainEntity";
import GameData from "./GameData";
import Vector from "../utils/Vector";

export type SerializedGameTerrain = SerializedGameTerrainEntity[];

class GameTerrain {
  private entities: GameTerrainEntity[];

  constructor(gameData: GameData) {
    this.entities = [];
  }

  getEntities() {
    return this.entities;
  }

  addEntity(entity: GameTerrainEntity) {
    this.entities.push(entity);
  }

  getGravityVectorForTurn(position: Vector, velocity: Vector, turn: number) {
    return velocity;
    //return this.ark.calculateNewPositionVelocity(position, velocity, turn);
  }

  getParentEntity(position: Vector, time: number, turn: number) {
    return this.entities[0];
  }

  serialize(): SerializedGameTerrain {
    return this.entities.map((entity) => entity.serialize());
  }

  deserialize(data: SerializedGameTerrain = []) {
    this.entities = data.map((entry) => new GameTerrainEntity(entry));

    return this;
  }
}

export default GameTerrain;
