import * as torpedoes from "./torpedo/index";
import * as conventional from "./conventional/index";
import Ammo from "./Ammo";
import Torpedo from "./torpedo/Torpedo";

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

export type TorpedoType = keyof typeof torpedoes;

export const createTorpedoInstance = (className: TorpedoType): Torpedo => {
  //@ts-ignore
  return new torpedoes[className]();
};
