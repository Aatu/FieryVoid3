import Weapon, { WeaponArgs } from "../Weapon";
import { WeaponArcs } from "../../strategy/weapon/WeaponArcStrategy";
declare class AutoCannon85mm extends Weapon {
    constructor({ id }: WeaponArgs, arcs: WeaponArcs);
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default AutoCannon85mm;
