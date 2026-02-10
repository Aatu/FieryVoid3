import Weapon, { WeaponArgs } from "../Weapon";
import { WeaponArcs } from "../../strategy/weapon/WeaponArcStrategy";
declare class PDC30mm extends Weapon {
    constructor({ id }: WeaponArgs, arcs: WeaponArcs);
    getDisplayName(): string;
    getBackgroundImage(): string;
    getSystemDescription(): string;
}
export default PDC30mm;
