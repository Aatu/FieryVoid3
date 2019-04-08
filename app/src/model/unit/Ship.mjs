import ShipSystems from "./ShipSystems.mjs";
import ShipEW from "./ShipEW.mjs";
import ShipPlayer from "./ShipPlayer.mjs";
import ShipMovement from "./ShipMovement";

class Ship {
  constructor(data = {}) {
    this.deserialize(data);
  }

  getHexPosition() {}

  deserialize(data = {}) {
    this.id = data.id || null;
    this.gameId = data.gameId || null;
    this.name = data.name || "Unnamed ship " + data.id;
    this.shipClass = this.constructor.name;
    this.accelcost = data.accelcost || 1;

    this.systems = new ShipSystems(this).deserialize(data.systems);
    this.player = new ShipPlayer(this).deserialize(data.player);
    this.movement = new ShipMovement(this).deserialize(data.movement);
    this.ew = new ShipEW(this);

    return this;
  }

  serialize() {
    return {
      id: this.id,
      gameId: this.gameId,
      name: this.name,
      shipClass: this.shipClass,
      systems: this.systems.serialize(),
      player: this.player.serialize(),
      movement: this.movement.serialize()
    };
  }

  isDestroyed() {
    return false;
  }
}

export default Ship;
