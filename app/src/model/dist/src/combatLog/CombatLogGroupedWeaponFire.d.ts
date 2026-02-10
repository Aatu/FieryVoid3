import { ICombatLogEntry } from "./combatLogClasses";
import CombatLogWeaponFire, { SerializedCombatLogWeaponFire } from "./CombatLogWeaponFire";
export type SerializedCombatLogGroupedWeaponFire = {
    logEntryClass: string;
    targetId: string;
    entries: SerializedCombatLogWeaponFire[];
};
declare class CombatLogGroupedWeaponFire implements ICombatLogEntry {
    targetId: string;
    entries: CombatLogWeaponFire[];
    replayOrder: number;
    constructor(targetId: string);
    addEntry(fire: CombatLogWeaponFire): void;
    serialize(): SerializedCombatLogGroupedWeaponFire;
    deserialize(unknownData: Record<string, unknown>): this;
}
export default CombatLogGroupedWeaponFire;
