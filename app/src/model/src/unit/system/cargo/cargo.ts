import { ammunition } from "../weapon/ammunition/index";
import CargoEntity from "./CargoEntity";

export const cargoClasses = { ...ammunition };

export type CargoType = keyof typeof cargoClasses;

export const createCargoInstance = (className: CargoType): CargoEntity => {
  //@ts-ignore
  return new cargoClasses[className]();
};

export interface ICargo {
  getSpaceRequired(): number;
}
