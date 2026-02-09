import ShipSystem, { ShipSystemType, SystemArgs } from "../ShipSystem";
import ShipSystemStrategy from "../strategy/ShipSystemStrategy";
export type WeaponArgs = SystemArgs & {
    alwaysTargetable?: boolean;
};
declare class Weapon extends ShipSystem {
    constructor(args: WeaponArgs, strategies: ShipSystemStrategy[]);
    getSystemType(): ShipSystemType;
    isWeapon(): boolean;
    showOnSystemList(): boolean;
}
export default Weapon;
