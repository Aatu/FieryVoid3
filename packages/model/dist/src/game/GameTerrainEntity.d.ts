import Vector from "../utils/Vector";
export type SerializedGameTerrainEntity = {
    id?: string | null;
    type?: string;
    mass?: number;
    position?: Vector;
    velocity?: Vector;
    diameter?: number;
    radius?: number;
    gravity?: number;
};
declare class GameTerrainEntity {
    id: string | null;
    type: string;
    mass: number;
    position: Vector;
    velocity: Vector;
    diameter: number;
    radius: number;
    affectedByGravity: boolean;
    gravity: number;
    constructor(data: SerializedGameTerrainEntity);
    getGravityVector(position: Vector): Vector;
    deserialize(data?: SerializedGameTerrainEntity): this;
    serialize(): {
        id: string | null;
        type: string;
        position: Vector;
        velocity: Vector;
        radius: number;
        mass: number;
    };
}
export default GameTerrainEntity;
