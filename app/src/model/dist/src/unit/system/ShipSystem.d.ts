import SystemDamage, { SerializedSystemDamage } from "./SystemDamage";
import SystemPower, { SerializedSystemPower } from "./SystemPower";
import SystemHeat, { SerializedSystemHeat } from "./SystemHeat";
import ShipSystemStrategy from "./strategy/ShipSystemStrategy";
import { SYSTEM_HANDLERS, SystemMessage } from "./strategy/types/SystemHandlersTypes";
import ShipSystems from "../ShipSystems";
import DamageEntry from "./DamageEntry";
import Critical from "./criticals/Critical";
import ShipSystemLog, { SerializedShipSystemLog } from "./ShipSystemLog/ShipSystemLog";
import { SystemHandlers } from "../ShipSystemHandlers";
import { Structure } from "./structure";
import SystemSection from "./systemSection/SystemSection";
export type SerializedShipSystem = {
    power?: SerializedSystemPower;
    damage?: SerializedSystemDamage;
    heat?: SerializedSystemHeat;
    log?: SerializedShipSystemLog;
};
export type SystemArgs = {
    id: number;
    hitpoints?: number;
    armor?: number;
};
export declare enum ShipSystemType {
    INTERNAL = "internal",
    EXTERNAL = "external",
    STRUCTURE = "structure"
}
declare class ShipSystem {
    id: number;
    hitpoints: number;
    armor: number;
    strategies: ShipSystemStrategy[];
    power: SystemPower;
    damage: SystemDamage;
    shipSystems: null | ShipSystems;
    heat: SystemHeat;
    log: ShipSystemLog;
    handlers: SystemHandlers;
    constructor(args: SystemArgs, strategies?: ShipSystemStrategy[]);
    getShip(): import("../Ship").default;
    getStructure(): Structure | null;
    getSection(): SystemSection;
    getSystemType(): ShipSystemType;
    getShipSystems(): ShipSystems;
    getSystemDescription(): string;
    addStrategy(strategy: ShipSystemStrategy): void;
    addShipSystemsReference(shipSystems: ShipSystems): void;
    getSystemInfo(): SystemMessage[];
    getDisplayName(): string | null;
    getBackgroundImage(): string;
    getIconText(): string;
    isDestroyed(): boolean;
    isDisabled(): boolean;
    getArmor(): number;
    getRemainingHitpoints(): number;
    getTotalDamage(): number;
    addDamage(damage: DamageEntry): void;
    addCritical(critical: Critical): void;
    hasAnyCritical(): boolean;
    hasCritical(name: typeof Critical | Critical | string): boolean;
    callHandler<T extends unknown>(name: SYSTEM_HANDLERS, payload: unknown | undefined, response: T): T;
    getStrategiesByInstance<T extends ShipSystemStrategy>(instance: any): T[];
    deserialize(data?: SerializedShipSystem): this;
    serialize(): SerializedShipSystem;
    endTurn(turn: number): void;
    advanceTurn(turn: number): void;
    isWeapon(): boolean;
    showOnSystemList(): boolean;
}
export default ShipSystem;
