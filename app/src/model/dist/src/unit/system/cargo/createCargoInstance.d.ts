import CargoEntity from "../../../cargo/CargoEntity";
import { CargoType } from "./cargo";
export declare const createCargoInstance: <T extends CargoEntity = CargoEntity>(className: CargoType) => T;
export declare const cloneCargoEntity: (entity: CargoEntity) => CargoEntity;
