import { ammunition } from "../weapon/ammunition/index";
import CargoEntity from "./CargoEntity";

export const cargoClasses = { ...ammunition };

export type CargoType = keyof typeof cargoClasses;

export const createCargoInstance = (classname: CargoType): CargoEntity => {
  //@ts-ignore
  return new classname();
};

export interface ICargo {
  getSpaceRequired(): number;
}
