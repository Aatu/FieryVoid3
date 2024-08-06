import { createShipObject } from "../unit/createShipObject.mjs";
import Ship from "../unit/Ship";
import { User } from "../User/User";
import GameData from "./GameData";

class GameShips {
  private gameData: GameData;
  private ships: Ship[] = [];

  constructor(gameData: GameData) {
    this.gameData = gameData;
    this.ships = [];
  }

  isSameTeam(shipA: Ship, shipB: Ship) {
    return (
      this.gameData.slots.getTeamForShip(shipA) ===
      this.gameData.slots.getTeamForShip(shipB)
    );
  }

  addShip(ship: Ship) {
    if (ship.id && this.getShipById(ship.id)) {
      throw new Error("Duplicate ship is added to gamedata");
    }

    this.ships.push(ship);
    return this;
  }

  getShips() {
    return this.ships;
  }

  getAliveShips() {
    return this.ships.filter((ship) => !ship.isDestroyed());
  }

  getShipById(id: string) {
    return this.ships.find((ship) => ship.id === id);
  }

  getUsersShips(user: User) {
    return this.ships.filter(
      (ship) => ship.player.isUsers(user) && !ship.isDestroyed()
    );
  }

  getShipsInSameTeam(user) {
    const slot = this.gameData.slots.getUsersSlots(user);
    if (!slot || slot.length === 0) {
      return [];
    }
    const team = slot.pop().team;

    return this.ships.filter(
      (ship) =>
        this.gameData.slots.getSlotByShip(ship).team === team &&
        !ship.isDestroyed()
    );
  }

  getShipsEnemyTeams(user) {
    const teamShips = this.getShipsInSameTeam(user);

    return this.ships.filter(
      (ship) => !teamShips.includes(ship) && !ship.isDestroyed()
    );
  }

  serialize() {
    return this.ships.map((ship) => ship.serialize());
  }

  deserialize(ships = []) {
    this.ships = ships.map((shipData) => createShipObject(shipData));

    return this;
  }

  setShipLoadouts() {
    this.getShips().forEach((ship) => ship.setShipLoadout());
  }
}

export default GameShips;
