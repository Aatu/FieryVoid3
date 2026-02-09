import { ICombatLogEntry } from "./combatLogClasses";
declare class CombatLogTorpedoOutOfTime implements ICombatLogEntry {
    torpedoFlightId: string;
    replayOrder: number;
    constructor(torpedoFlightId: string);
    serialize(): {
        logEntryClass: string;
        torpedoFlightId: string;
    };
    deserialize(data: {
        logEntryClass: string;
        torpedoFlightId: string;
    }): this;
}
export default CombatLogTorpedoOutOfTime;
