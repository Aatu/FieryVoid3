import Weapon from "../Weapon";
import { WeaponArc } from "../../strategy/weapon/WeaponArcStrategy";
import { SystemArgs } from "../../ShipSystem";
declare class CoilgunLightFixed extends Weapon {
    constructor({ id }: SystemArgs, arcs: WeaponArc | WeaponArc[]);
    getDisplayName(): string;
    getBackgroundImage(): string;
}
export default CoilgunLightFixed;
