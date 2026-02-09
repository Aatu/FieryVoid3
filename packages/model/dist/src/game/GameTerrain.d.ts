import GameTerrainEntity, { SerializedGameTerrainEntity } from "./GameTerrainEntity";
import GameData from "./GameData";
import Vector from "../utils/Vector";
export type SerializedGameTerrain = SerializedGameTerrainEntity[];
declare class GameTerrain {
    private entities;
    constructor(gameData: GameData);
    getEntities(): GameTerrainEntity[];
    addEntity(entity: GameTerrainEntity): void;
    getGravityVectorForTurn(position: Vector, velocity: Vector, turn: number): Vector;
    getParentEntity(position: Vector, time: number, turn: number): GameTerrainEntity | undefined;
    serialize(): SerializedGameTerrain;
    deserialize(data?: SerializedGameTerrain): this;
}
export default GameTerrain;
