import { ICombatLogEntry } from "./combatLogClasses";
declare class CombatLogWeaponOutOfArc implements ICombatLogEntry {
    fireOrderId: string;
    replayOrder: number;
    constructor(fireOrderId: string);
    serialize(): {
        logEntryClass: string;
        fireOrderId: string;
    };
    deserialize(unknownData: Record<string, unknown>): this;
}
export default CombatLogWeaponOutOfArc;
