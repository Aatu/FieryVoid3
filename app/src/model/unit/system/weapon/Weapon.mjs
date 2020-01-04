import ShipSystem from "../ShipSystem.mjs";

class Weapon extends ShipSystem {
  constructor(args, strategies) {
    super(args, strategies);
  }

  isWeapon() {
    return true;
  }

  showOnSystemList() {
    return true;
  }
}

export default Weapon;
