import CargoEntity from "../../../cargo/CargoEntity";
import { cargoClasses, CargoType } from "./cargo";

export const createCargoInstance = <T extends CargoEntity = CargoEntity>(
  className: CargoType
): T => {
  if (!cargoClasses[className]) {
    throw new Error(`Unrecognized cargo name "${className}"`);
  }
  //@ts-ignore
  return new cargoClasses[className]();
};

export const cloneCargoEntity = (entity: CargoEntity): CargoEntity =>
  createCargoInstance(entity.getCargoClassName());
