import { ICombatLogEntry } from "./combatLogClasses";
declare class CombatLogShipMovement implements ICombatLogEntry {
    shipId: string;
    replayOrder: number;
    constructor(shipId: string);
    serialize(): {
        logEntryClass: string;
        shipId: string;
    };
    deserialize(unknownData: Record<string, unknown>): this;
}
export default CombatLogShipMovement;
