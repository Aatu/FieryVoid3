import Weapon, { WeaponArgs } from "./Weapon";
import { WeaponArcs } from "../strategy/weapon/WeaponArcStrategy";
declare class TestWeapon extends Weapon {
    constructor(args: WeaponArgs, arcs: WeaponArcs);
}
export default TestWeapon;
