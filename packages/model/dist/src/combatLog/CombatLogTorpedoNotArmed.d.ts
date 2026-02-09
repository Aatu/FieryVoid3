import { ICombatLogEntry } from "./combatLogClasses";
declare class CombatLogTorpedoNotArmed implements ICombatLogEntry {
    torpedoFlightId: string;
    turnsActive: number;
    armingTime: number;
    replayOrder: number;
    constructor(torpedoFlightId: string, turnsActive: number, armingTime: number);
    serialize(): {
        logEntryClass: string;
        torpedoFlightId: string;
        turnsActive: number;
        armingTime: number;
    };
    deserialize(data: {
        logEntryClass: string;
        torpedoFlightId: string;
        turnsActive: number;
        armingTime: number;
    }): this;
}
export default CombatLogTorpedoNotArmed;
