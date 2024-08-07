import * as torpedoes from "./torpedo/index";
import * as conventional from "./conventional/index";
import NoAmmunitionLoaded from "./NoAmmunitionLoaded";
import Ammo from "./Ammo";

export const ammunition = {
  ...torpedoes,
  ...conventional,
  NoAmmunitionLoaded,
};
export type AmmunitionType = keyof typeof ammunition;

export const createAmmoInstance = (classname: AmmunitionType): Ammo => {
  //@ts-ignore
  return new classname();
};

export const ammunitionClasses = Object.values(ammunition);
