import ShipSystem, { SystemArgs } from "../ShipSystem";
import AlwaysTargetableSystemStrategy from "../strategy/AlwaysTargetableSystemStrategy";
import ShipSystemStrategy from "../strategy/ShipSystemStrategy";

export type WeaponArgs = SystemArgs & { alwaysTargetable?: boolean };

class Weapon extends ShipSystem {
  constructor(args: WeaponArgs, strategies: ShipSystemStrategy[]) {
    super(args, strategies);

    if (args.alwaysTargetable) {
      this.addStrategy(new AlwaysTargetableSystemStrategy());
    }
  }

  isWeapon() {
    return true;
  }

  showOnSystemList() {
    return true;
  }
}

export default Weapon;
