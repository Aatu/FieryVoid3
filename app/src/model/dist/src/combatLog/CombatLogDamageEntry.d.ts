import Ship from "../unit/Ship";
import DamageEntry from "../unit/system/DamageEntry";
import ShipSystem from "../unit/system/ShipSystem";
import { ICombatLogEntry } from "./combatLogClasses";
export type SerializedCombatLogDamageEntry = {
    logEntryClass: string;
    entries: {
        systemId: number;
        damageIds: string[];
    }[];
    notes: string[];
};
declare class CombatLogDamageEntry implements ICombatLogEntry {
    entries: {
        systemId: number;
        damageIds: string[];
    }[];
    notes: string[];
    replayOrder: number;
    constructor();
    addNote(note: string): void;
    serialize(): SerializedCombatLogDamageEntry;
    deserialize(unknownData: Record<string, unknown>): this;
    add(system: ShipSystem, damage: DamageEntry | DamageEntry[]): void;
    getDamages(target: Ship): DamageEntry[];
}
export default CombatLogDamageEntry;
