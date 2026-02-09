import DamageEntry from "../DamageEntry";
import ShipSystem from "../ShipSystem";
import ShipSystemLogEntry, { SerializedSystemLogEntry } from "./ShipSystemLogEntry";
export type SerializedShipSystemLogEntryDamage = SerializedSystemLogEntry & {
    blockedByArmor?: number;
    damage?: number;
    wasDestroyed?: boolean;
};
declare class ShipSystemLogEntryDamage extends ShipSystemLogEntry {
    private damage;
    private blockedByArmor;
    private wasDestroyed;
    constructor(system: ShipSystem);
    addDamage(damageEntry: DamageEntry): void;
    serialize(): SerializedShipSystemLogEntryDamage;
    deserialize(data?: SerializedShipSystemLogEntryDamage): this;
    getMessage(): string[];
}
export default ShipSystemLogEntryDamage;
