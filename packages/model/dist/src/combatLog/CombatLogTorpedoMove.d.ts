import Vector from "../utils/Vector";
import { ICombatLogEntry } from "./combatLogClasses";
export type SerializedCombatLogTorpedoMove = {
    logEntryClass: string;
    torpedoFlightId: string;
    startPosition: Vector;
    endPosition: Vector;
    velocity: Vector;
};
declare class CombatLogTorpedoMove implements ICombatLogEntry {
    torpedoFlightId: string;
    startPosition: Vector;
    endPosition: Vector;
    velocity: Vector;
    replayOrder: number;
    constructor(torpedoFlightId: string, startPosition: Vector, endPosition: Vector, velocity: Vector);
    serialize(): SerializedCombatLogTorpedoMove;
    deserialize(unknownData: Record<string, unknown>): this;
}
export default CombatLogTorpedoMove;
