import ShipSystems from "./ShipSystems.mjs";
import ShipElectronicWarfare from "./ShipElectronicWarfare.mjs";
import ShipPlayer from "./ShipPlayer.mjs";
import ShipMovement from "./ShipMovement.mjs";
import {
  getCompassHeadingOfPoint,
  addToDirection,
  hexFacingToAngle
} from "../utils/math.mjs";
import HexagonMath from "../utils/HexagonMath.mjs";
import Offset from "../hexagon/Offset.mjs";
import coordinateConverter from "../utils/CoordinateConverter.mjs";

class Ship {
  constructor(data = {}) {
    this.systems = new ShipSystems(this);
    this.pointCost = 0;
    this.accelcost = 1;
    this.rollcost = 1;
    this.pivotcost = 1;
    this.maxPivots = null;
    this.evasioncost = 1;
    this.frontHitProfile = 30;
    this.sideHitProfile = 50;
    this.hexSizes = [];

    this.shipModel = null;
    this.shipTypeName = "";
    this.setShipProperties();
    this.deserialize(data);
  }

  setShipProperties() {}

  getFrontHitProfile() {
    return (
      this.frontHitProfile +
      this.systems
        .callAllSystemHandlers("getHitProfile", { front: true })
        .reduce((total, entry) => total + entry, 0)
    );
  }

  getSideHitProfile() {
    return (
      this.sideHitProfile +
      this.systems
        .callAllSystemHandlers("getHitProfile", { front: false })
        .reduce((total, entry) => total + entry, 0)
    );
  }

  getHitProfile(position) {
    const heading = addToDirection(
      getCompassHeadingOfPoint(this.getPosition(), position),
      -hexFacingToAngle(this.getFacing())
    );

    if (heading >= 330 || heading <= 30 || (heading >= 150 && heading <= 210)) {
      return this.getFrontHitProfile();
    } else {
      return this.getSideHitProfile();
    }
  }

  getPointCost() {
    return this.pointCost;
  }

  getFacing() {
    const lastMove = this.movement.getLastEndMoveOrSurrogate();
    if (!lastMove) {
      return null;
    }

    return lastMove.getFacing();
  }

  getPosition() {
    const lastMove = this.movement.getLastEndMoveOrSurrogate();
    if (!lastMove) {
      return null;
    }

    return lastMove.getPosition();
  }

  getHexPosition() {
    return coordinateConverter.fromGameToHex(this.getPosition());
  }

  distanceTo(target) {
    return this.getPosition().distanceTo(target.getPosition());
  }

  hexDistanceTo(target) {
    return this.getHexPosition().distanceTo(target.getHexPosition());
  }

  getVelocity() {
    const lastMove = this.movement.getLastEndMoveOrSurrogate();
    if (!lastMove) {
      return null;
    }

    return lastMove.getVelocity();
  }

  getIconHexas(hexFacing = 0) {
    return this.hexSizes.map(hex => hex.rotate(hexFacing));
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
    this.destroyedThisTurn = data.destroyedThisTurn || false;

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
      },
      destroyedThisTurn: this.destroyedThisTurn
    };
  }

  isDestroyed() {
    return this.systems.isDestroyed();
  }

  isDestroyedThisTurn() {
    return this.destroyedThisTurn;
  }

  markDestroyedThisTurn() {
    this.destroyedThisTurn = true;
  }

  censorForUser(user, mine) {
    if (!mine) {
      this.movement.removeMovementExceptEnd(this.turn);
    }
    this.systems.censorForUser(user, mine);
  }

  endTurn(turn) {
    this.systems.endTurn(turn);
  }

  advanceTurn(turn) {
    this.movement.removeMovementForOtherTurns(turn);
    this.systems.advanceTurn(turn);
    this.electronicWarfare.activatePlannedElectronicWarfare();
    this.electronicWarfare.removeAll();
    //this.electronicWarfare.repeatElectonicWarfare();

    this.destroyedThisTurn = false;
    return this;
  }

  receivePlayerData(clientShip, gameData) {
    this.systems.receivePlayerData(clientShip, gameData);
  }

  setShipLoadout() {
    this.systems.callAllSystemHandlers("loadTargetInstant");
  }
}

export default Ship;
