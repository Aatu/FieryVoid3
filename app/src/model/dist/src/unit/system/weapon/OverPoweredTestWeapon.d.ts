import Weapon, { WeaponArgs } from "./Weapon";
import { WeaponArcs } from "../strategy/weapon/WeaponArcStrategy";
declare class OverPoweredTestWeapon extends Weapon {
    constructor(args: WeaponArgs, arcs: WeaponArcs);
}
export default OverPoweredTestWeapon;
