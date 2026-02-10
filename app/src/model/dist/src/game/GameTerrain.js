import GameTerrainEntity from "./GameTerrainEntity";
class GameTerrain {
    entities;
    constructor(gameData) {
        this.entities = [];
    }
    getEntities() {
        return this.entities;
    }
    addEntity(entity) {
        this.entities.push(entity);
    }
    getGravityVectorForTurn(position, velocity, turn) {
        return velocity;
        //return this.ark.calculateNewPositionVelocity(position, velocity, turn);
    }
    getParentEntity(position, time, turn) {
        return this.entities[0];
    }
    serialize() {
        return this.entities.map((entity) => entity.serialize());
    }
    deserialize(data = []) {
        this.entities = data.map((entry) => new GameTerrainEntity(entry));
        return this;
    }
}
export default GameTerrain;
