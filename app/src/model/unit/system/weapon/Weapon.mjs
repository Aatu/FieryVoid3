import ShipSystem from "../ShipSystem.mjs";
import AlwaysTargetableSystemStrategy from "../strategy/AlwaysTargetableSystemStrategy.mjs";

class Weapon extends ShipSystem {
  constructor(args, strategies) {
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
