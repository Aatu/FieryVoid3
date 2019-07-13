import ShipSystems from "./ShipSystems.mjs";
import ShipElectronicWarfare from "./ShipElectronicWarfare.mjs";
import ShipPlayer from "./ShipPlayer.mjs";
import ShipMovement from "./ShipMovement.mjs";
import {
  getCompassHeadingOfPoint,
  addToDirection,
  hexFacingToAngle
} from "../utils/math.mjs";

class Ship {
  constructor(data = {}) {
    this.systems = new ShipSystems(this);
    this.pointCost = 0;
    this.accelcost = 1;
    this.rollcost = 1;
    this.pivotcost = 1;
    this.evasioncost = 1;
    this.frontHitProfile = 30;
    this.sideHitProfile = 50;

    this.shipModel = null;
    this.shipTypeName = "";
    this.setShipProperties();
    this.deserialize(data);
  }

  setShipProperties() {}

  getHitProfile(position) {
    const heading = addToDirection(
      getCompassHeadingOfPoint(this.getPosition(), position),
      -hexFacingToAngle(this.getFacing())
    );

    console.log("heading", heading);

    if (heading >= 330 || heading <= 30 || (heading >= 150 && heading <= 210)) {
      return this.frontHitProfile;
    } else {
      return this.sideHitProfile;
    }
  }

  getPointCost() {
    return this.pointCost;
  }

  getFacing() {
    const lastMove = this.movement.getLastMove();
    if (!lastMove) {
      return null;
    }

    return lastMove.getFacing();
  }

  getPosition() {
    const lastMove = this.movement.getLastMove();
    if (!lastMove) {
      return null;
    }

    return lastMove.getPosition();
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
    this.electronicWarfare = new ShipElectronicWarfare(this).deserialize(
      shipData.electronicWarfare
    );

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
        player: this.player.serialize(),
        electronicWarfare: this.electronicWarfare.serialize()
      }
    };
  }

  isDestroyed() {
    return false;
  }

  censorForUser(user, mine) {
    if (!mine) {
      this.movement.removeMovementExceptEnd(this.turn);
    }
    this.systems.censorForUser(user, mine);
  }

  advanceTurn(turn) {
    this.movement.removeMovementForOtherTurns(turn);
    this.systems.advanceTurn(turn);
    this.electronicWarfare.activatePlannedElectronicWarfare();
    this.electronicWarfare.repeatElectonicWarfare();

    return this;
  }
}

export default Ship;
