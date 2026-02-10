import ShipSystemStrategy from "./ShipSystemStrategy";
import { CargoType } from "../cargo/cargo";
import { CargoEntry, SerializedCargoEntry } from "../../../cargo/CargoEntry";
import CargoEntity from "../../../cargo/CargoEntity";
import Ship from "../../Ship";
import ShipSystem from "../ShipSystem";
import { IShipSystemStrategy } from "../../ShipSystemHandlers";
export type SerializedCargoBaySystemStrategy = {
    cargoBaySystemStrategy?: {
        cargo: SerializedCargoEntry[];
    };
};
declare class CargoBaySystemStrategy extends ShipSystemStrategy implements IShipSystemStrategy {
    protected space: number;
    protected cargo: CargoEntry[];
    protected allowedCargoClasses: CargoType[] | null;
    constructor(space: number, allowedCargoClasses?: CargoType[]);
    getUiComponents(payload: unknown, previousResponse?: never[]): {
        name: string;
        props: {
            list: {
                object: CargoEntity;
                amount: number;
            }[];
        };
    }[];
    serialize(payload: unknown, previousResponse?: {}): SerializedCargoBaySystemStrategy;
    deserialize(data?: SerializedCargoBaySystemStrategy): this;
    canAcceptCargo(cargo: CargoEntry[] | CargoEntry): boolean;
    getTotalCargoSpace(): number;
    getAvailableCargoSpace(): number;
    getAllCargo(): CargoEntry<CargoEntity>[];
    getCargoSpaceUsed(): number;
    getCargoEntry(object: CargoEntity): CargoEntry | null;
    isAllowedCargo(cargo: CargoEntry): boolean;
    hasCargo(payload: CargoEntry[] | CargoEntry): boolean;
    removeAllCargo(): void;
    removeCargo(cargo: CargoEntry | CargoEntry[]): void;
    addCargo(cargo: CargoEntry | CargoEntry[]): void;
    isCargoBay(): boolean;
    receivePlayerData({ clientShip, clientSystem, }: {
        clientShip: Ship;
        clientSystem: ShipSystem;
    }): void;
}
export default CargoBaySystemStrategy;
