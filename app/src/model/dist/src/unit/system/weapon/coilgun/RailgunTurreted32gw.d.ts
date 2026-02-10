import Weapon, { WeaponArgs } from "../Weapon";
import { WeaponArcs } from "../../strategy/weapon/WeaponArcStrategy";
declare class RailgunTurreted32gw extends Weapon {
    constructor(args: WeaponArgs, arcs: WeaponArcs);
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default RailgunTurreted32gw;
