import ShipSystems from "./ShipSystems.mjs";
import ShipEW from "./ShipEW.mjs";
import ShipPlayer from "./ShipPlayer.mjs";
import ShipMovement from "./ShipMovement";

class Ship {
  constructor() {
    this.systems = new ShipSystems(this);
    this.ew = new ShipEW(this);
    this.player = new ShipPlayer(this);
    this.movement = new ShipMovement(this);
  }

  getHexPosition() {}

  deserialize() {}

  serialize() {}

  isDestroyed() {
    return false;
  }
}

export default Ship;
