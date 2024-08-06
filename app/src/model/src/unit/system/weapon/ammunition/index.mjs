import * as torpedoes from "./torpedo/index.mjs";
import * as conventional from "./conventional/index.js";
import NoAmmunitionLoaded from "./NoAmmunitionLoaded.mjs";

export const ammunition = {
  ...torpedoes,
  ...conventional,
  NoAmmunitionLoaded,
};
