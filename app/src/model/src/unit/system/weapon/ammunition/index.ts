import { torpedoes } from "./torpedo/index";
import * as conventional from "./conventional/index";
import Ammo from "./Ammo";

export const ammunition = {
  ...torpedoes,
  ...conventional,
};
export type AmmunitionType = keyof typeof ammunition;

export const createAmmoInstance = (className: AmmunitionType): Ammo => {
  //@ts-ignore
  return new ammunition[className]();
};

export const ammunitionClasses = Object.values(ammunition);
