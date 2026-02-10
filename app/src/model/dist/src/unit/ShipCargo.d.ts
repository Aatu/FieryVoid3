import { CargoEntry } from "../cargo/CargoEntry";
import Ship from "./Ship";
import ShipSystem from "./system/ShipSystem";
export declare class ShipCargo {
    private ship;
    constructor(ship: Ship);
    canMove(from: ShipSystem, to: ShipSystem, cargo: CargoEntry | CargoEntry[]): boolean;
    hasCargo(cargo: CargoEntry[] | CargoEntry): boolean;
    getAllCargo(): CargoEntry<import("../cargo/CargoEntity").default>[];
    removeAllCargo(): void;
    removeCargo(cargo: CargoEntry[] | CargoEntry): void;
    moveCargo(from: ShipSystem, to: ShipSystem, cargo: CargoEntry | CargoEntry[]): void;
    addCargo(cargo: CargoEntry | CargoEntry[]): void;
    private systemhasCargoSpaceFor;
}
export declare const subtractCargos: (current: CargoEntry[], sub: CargoEntry[]) => CargoEntry<import("../cargo/CargoEntity").default>[];
export declare const addCargos: (current: CargoEntry[], add: CargoEntry[]) => CargoEntry<import("../cargo/CargoEntity").default>[];
export declare const cargoContains: (current: CargoEntry[], other: CargoEntry[]) => boolean;
export declare const combineCargoEntrys: (entries: CargoEntry[]) => CargoEntry[];
