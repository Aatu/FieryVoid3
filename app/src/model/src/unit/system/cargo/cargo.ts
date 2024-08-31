import CargoEntity from "../../../cargo/CargoEntity";
import { ammunition } from "../weapon/ammunition/index";

export const cargoClasses = { ...ammunition };

export type CargoType = keyof typeof cargoClasses;

export const createCargoInstance = <T extends CargoEntity = CargoEntity>(
  className: CargoType
): T => {
  if (!cargoClasses[className]) {
    throw new Error(`Unrecognized cargo name "${className}"`);
  }
  //@ts-ignore
  return new cargoClasses[className]();
};

export interface ICargo {
  getSpaceRequired(): number;
}
