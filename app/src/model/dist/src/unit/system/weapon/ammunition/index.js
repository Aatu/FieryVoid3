import * as torpedoes from "./torpedo/index";
import * as conventional from "./conventional/index";
export const ammunition = {
    ...torpedoes,
    ...conventional,
};
export const createAmmoInstance = (className) => {
    //@ts-ignore
    return new ammunition[className]();
};
export const ammunitionClasses = Object.values(ammunition);
export const createTorpedoInstance = (className) => {
    //@ts-ignore
    return new torpedoes[className]();
};
