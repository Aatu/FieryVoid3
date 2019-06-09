import ShipSystems from "./ShipSystems.mjs";
import ShipEW from "./ShipEW.mjs";
import ShipPlayer from "./ShipPlayer.mjs";
import ShipMovement from "./ShipMovement";

class Ship {
  constructor(data = {}) {
    this.systems = new ShipSystems(this);
    this.deserialize(data);
    this.pointCost = 0;
    this.accelcost = 1;
    this.rollcost = 1;
    this.pivotcost = 1;
    this.evasioncost = 1;

    this.shipModel = null;
    this.shipTypeName = "";
  }

  getPointCost() {
    return this.pointCost;
  }

  getHexPosition() {
    const lastMove = this.movement.getLastMove();
    if (!lastMove) {
      return null;
    }

    return lastMove.getHexPosition();
  }

  deserialize(data = {}) {
    const shipData = data.shipData || {};
    this.id = data.id || null;
    this.name = data.name || "Unnamed ship ";
    this.shipClass = this.constructor.name;
    this.slotId = data.slotId || null;

    this.systems.deserialize(shipData.systems);
    this.player = new ShipPlayer(this).deserialize(shipData.player);
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
      slotId: this.slotId,
      movement: this.movement.serialize(),
      shipData: {
        systems: this.systems.serialize(),
        player: this.player.serialize()
      }
    };
  }

  isDestroyed() {
    return false;
  }
}

export default Ship;
