import { ammunition } from "../weapon/ammunition/index";

export const cargoClasses = { ...ammunition };

export type CargoType = keyof typeof cargoClasses;

export interface ICargo {
  getSpaceRequired(): number;
}
