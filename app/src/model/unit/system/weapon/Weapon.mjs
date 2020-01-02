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

  getIconText() {
    return (
      this.callHandler("getTurnsLoaded") +
      "/" +
      this.callHandler("getLoadingTime")
    );
  }
}

export default Weapon;
