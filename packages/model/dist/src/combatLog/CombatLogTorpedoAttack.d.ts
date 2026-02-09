import Ship from "../unit/Ship";
import DamageEntry from "../unit/system/DamageEntry";
import ShipSystem from "../unit/system/ShipSystem";
import { ICombatLogEntry } from "./combatLogClasses";
import CombatLogDamageEntry, { SerializedCombatLogDamageEntry } from "./CombatLogDamageEntry";
export type SerializedCombatLogTorpedoAttack = {
    logEntryClass: string;
    torpedoFlightId: string;
    targetId: string;
    damages: SerializedCombatLogDamageEntry[];
    notes: string[];
};
declare class CombatLogTorpedoAttack implements ICombatLogEntry {
    torpedoFlightId: string;
    targetId: string;
    damages: CombatLogDamageEntry[];
    notes: string[];
    replayOrder: number;
    static fromData(data: SerializedCombatLogTorpedoAttack): CombatLogTorpedoAttack;
    constructor(torpedoFlightId: string, targetId: string);
    addNote(note: string): void;
    addDamage(damageEntry: CombatLogDamageEntry): void;
    getDamages(target: Ship): DamageEntry[];
    getDestroyedSystems(target: Ship): ShipSystem[];
    serialize(): SerializedCombatLogTorpedoAttack;
    deserialize(unknownData: Record<string, unknown>): this;
}
export default CombatLogTorpedoAttack;
