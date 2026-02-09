import Ship from "../unit/Ship";
import CargoEntity from "../unit/system/cargo/CargoEntity";
export type CargoEntry<T extends CargoEntity = CargoEntity> = {
    object: T;
    amount: number;
};
declare class CargoService {
    divideCargo(ship: Ship, cargo: CargoEntry): void;
    hasSpaceForHowMany(ship: Ship, cargo: CargoEntry): number;
    hasSpaceFor(ship: Ship, cargo: CargoEntry): boolean;
    getShipWideCargoSpaceAvailable(ship: Ship): number;
    getBaysWithSpace(ship: Ship): import("../unit/system/ShipSystem").default[];
}
export default CargoService;
