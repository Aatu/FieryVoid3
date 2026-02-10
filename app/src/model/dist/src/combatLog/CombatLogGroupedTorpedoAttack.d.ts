import { ICombatLogEntry } from "./combatLogClasses";
import CombatLogTorpedoAttack, { SerializedCombatLogTorpedoAttack } from "./CombatLogTorpedoAttack";
export type SerializedCombatLogGroupedTorpedoAttack = {
    logEntryClass: string;
    targetId: string;
    entries: SerializedCombatLogTorpedoAttack[];
};
declare class CombatLogGroupedTorpedoAttack implements ICombatLogEntry {
    targetId: string;
    entries: CombatLogTorpedoAttack[];
    replayOrder: number;
    constructor(targetId: string);
    addEntry(attack: CombatLogTorpedoAttack): void;
    serialize(): SerializedCombatLogGroupedTorpedoAttack;
    deserialize(unknownData: Record<string, unknown>): this;
}
export default CombatLogGroupedTorpedoAttack;
