import { createShipObject } from "../unit/createShipObject.mjs";

class GameShips {
  constructor(gameData) {
    this.gameData = gameData;
    this.ships = [];
  }

  isSameTeam(shipA, shipB) {
    return (
      this.gameData.slots.getTeamForShip(shipA) ===
      this.gameData.slots.getTeamForShip(shipB)
    );
  }

  addShip(ship) {
    if (ship.id && this.getShipById(ship.id)) {
      throw new Error("Duplicate ship id added to gamedata");
    }

    this.ships.push(ship);
    return this;
  }

  getShips() {
    return this.ships;
  }

  getAliveShips() {
    return this.ships.filter(ship => !ship.isDestroyed());
  }

  getShipById(id) {
    return this.ships.find(ship => ship.id === id);
  }

  getUsersShips(user) {
    return this.ships.filter(ship => ship.player.isUsers(user));
  }

  getShipsInSameTeam(user) {
    const slot = this.gameData.slots.getUsersSlots(user);
    if (!slot) {
      return [];
    }
    const team = slot.pop().team;

    return this.ships.filter(
      ship => this.gameData.slots.getSlotByShip(ship).team === team
    );
  }

  getShipsEnemyTeams(user) {
    const teamShips = this.getShipsInSameTeam(user);

    return this.ships.filter(ship => !teamShips.includes(ship));
  }

  serialize() {
    return this.ships.map(ship => ship.serialize());
  }

  deserialize(ships = []) {
    this.ships = ships.map(shipData => createShipObject(shipData));

    return this;
  }

  setShipLoadouts() {
    console.log("set loadouts?");
    this.getShips().forEach(ship => ship.setShipLoadout());
  }
}

export default GameShips;
