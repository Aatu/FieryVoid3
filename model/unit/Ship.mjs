import ShipSystems from "./ShipSystems.mjs";
import ShipEW from "./ShipEW.mjs";

class Ship {
  constructor() {
    this.systems = new ShipSystems(this);
    this.ew = new ShipEW(this);
  }

  deserialize() {}

  serialize() {}

  isDestroyed() {
    return false;
  }
}

export default Ship;
