import { CombatLogEntry } from "./combatLogClasses";
import CombatLogTorpedoAttack from "./CombatLogTorpedoAttack";
import CombatLogTorpedoIntercept from "./CombatLogTorpedoIntercept";
export type SerializedCombatLogData = (Record<string, unknown> & {
    logEntryClass: string;
})[];
declare class CombatLogData {
    entries: CombatLogEntry[];
    constructor();
    addEntry(entry: CombatLogEntry): void;
    serialize(): SerializedCombatLogData;
    deserialize(data?: SerializedCombatLogData): this;
    advanceTurn(): void;
    getInterceptsFor(torpedoAttack: CombatLogTorpedoAttack): CombatLogTorpedoIntercept[];
    getForReplay(): CombatLogEntry[];
}
export default CombatLogData;
