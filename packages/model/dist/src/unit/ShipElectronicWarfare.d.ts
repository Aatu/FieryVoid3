import ElectronicWarfareEntry from "../electronicWarfare/ElectronicWarfareEntry";
import { EW_TYPE } from "../electronicWarfare/electronicWarfareTypes";
import Ship from "./Ship";
import ShipCurrentElectronicWarfare, { SearializedShipCurrentElectronicWarfare } from "./ShipCurrentElectronicWarfare";
import ShipSystem from "./system/ShipSystem";
export declare class UnableToAssignEw extends Error {
}
declare class ShipElectronicWarfare {
    ship: Ship;
    inEffect: ShipCurrentElectronicWarfare;
    constructor(ship: Ship);
    serialize(): SearializedShipCurrentElectronicWarfare;
    deserialize(data?: SearializedShipCurrentElectronicWarfare): this;
    activatePlannedElectronicWarfare(): void;
    canAssignCcEw(amount: number): boolean;
    assignCcEw(amount: number): void;
    assignOffensiveEw(target: Ship | string, amount: number): void;
    canAssignOffensiveEw(target: Ship | string, amount: number): boolean;
    getCcEw(): number;
    getDefensiveEw(): number;
    getOffensiveEw(target: Ship | string): number;
    getEw(type: EW_TYPE, target: Ship | string): number;
    assingEw(type: EW_TYPE, target: Ship | string, amount: number): void;
    canAssignEw(type: EW_TYPE, target: Ship | string, amount: number): boolean;
    getAllOew(): ElectronicWarfareEntry[];
    getAllEntries(): ElectronicWarfareEntry[];
    getEwArrays(): ShipSystem[];
    repeatElectonicWarfare(): void;
    removeAll(): void;
    assignEntries(entries: ElectronicWarfareEntry[], allowIncomplete?: boolean): void;
    assignPositiveEW(entry: ElectronicWarfareEntry, allowIncomplete: boolean): void;
    getAvailableSystemsForEntry(entry: ElectronicWarfareEntry): ShipSystem[];
}
export default ShipElectronicWarfare;
