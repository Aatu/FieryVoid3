import { ICombatLogEntry } from "./combatLogClasses";
declare class CombatLogTorpedoLaunch implements ICombatLogEntry {
    torpedoFlightId: string;
    replayOrder: number;
    constructor(torpedoFlightId: string);
    serialize(): {
        logEntryClass: string;
        torpedoFlightId: string;
    };
    deserialize(unknownData: Record<string, unknown>): this;
}
export default CombatLogTorpedoLaunch;
