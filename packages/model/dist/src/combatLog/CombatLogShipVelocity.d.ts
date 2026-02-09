import { ICombatLogEntry } from "./combatLogClasses";
declare class CombatLogShipVelocity implements ICombatLogEntry {
    shipId: string;
    replayOrder: number;
    constructor(shipId: string);
    serialize(): {
        logEntryClass: string;
        shipId: string;
    };
    deserialize(unknownData: Record<string, unknown>): this;
}
export default CombatLogShipVelocity;
