import DamageEntry, { SerializedDamageEntry } from "./DamageEntry";
import Critical, { SerializedCritical } from "./criticals/Critical";
import ShipSystem from "./ShipSystem";
export type SerializedSystemDamage = {
    entries?: SerializedDamageEntry[];
    criticals?: SerializedCritical[];
};
declare class SystemDamage {
    private system;
    private entries;
    private criticals;
    constructor(system: ShipSystem);
    serialize(): {
        entries: SerializedDamageEntry[];
        criticals: SerializedCritical[];
    };
    deserialize(data?: SerializedSystemDamage): this;
    addDamage(damage: DamageEntry): void;
    getDamageById(id: string): DamageEntry | undefined;
    addCritical(critical: Critical): void;
    filterReplaced(critical: Critical): void;
    hasCritical(object: string | Function | object): boolean;
    getCriticals(): Critical[];
    hasAnyCritical(): boolean;
    getTotalDamage(): number;
    getPercentUnDamaged(): number;
    getNewDamage(): number;
    isDestroyed(): boolean;
    advanceTurn(turn: number): void;
}
export default SystemDamage;
