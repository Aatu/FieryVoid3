import { ammunition } from "../weapon/ammunition/index.mjs";

export const cargoClasses = { ...ammunition };

export interface ICargo {
  getSpaceRequired(): number;
}
