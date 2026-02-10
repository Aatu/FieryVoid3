import ShipSystem from "../ShipSystem";
import ShipSystemLogEntry, { SerializedSystemLogEntry } from "./ShipSystemLogEntry";
type SerializedSystemLogEntryCriticalHit = SerializedSystemLogEntry & {
    newDamagePoints?: number;
    overHeatPoints?: number;
    oldDamagePoints?: number;
    criticalMessage?: string;
    extraPoints?: number;
};
declare class ShipSystemLogEntryCriticalHit extends ShipSystemLogEntry {
    private newDamagePoints;
    private overHeatPoints;
    private oldDamagePoints;
    private criticalMessage;
    private extraPoints;
    constructor(system: ShipSystem);
    setExtraPoints(amount: number): void;
    setNewDamagePoints(damage: number): void;
    setOldDamagePoints(damage: number): void;
    setOverHeatPoints(amount: number): void;
    setCriticalMessage(message: string): void;
    serialize(): SerializedSystemLogEntryCriticalHit;
    deserialize(data?: SerializedSystemLogEntryCriticalHit): this;
    getMessage(): string[];
}
export default ShipSystemLogEntryCriticalHit;
