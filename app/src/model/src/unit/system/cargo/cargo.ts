import { ammunition } from "../weapon/ammunition/index";

export const cargoClasses = { ...ammunition };

export interface ICargo {
  getSpaceRequired(): number;
}
