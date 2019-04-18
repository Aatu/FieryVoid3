import createShipObject from "../unit/createShipObject";

class GameShips {
  constructor(gameData) {
    this.gameData = gameData;
    this.ships = [];
  }

  addShip(ship) {
    if (this.getShipById(ship.id)) {
      throw new Error("Duplicate ship id added to gamedata");
    }

    this.ships.push(ship);
    return this;
  }

  getShips() {
    return this.ships;
  }

  getShipById(id) {
    return this.ships.find(ship => ship.id === id);
  }

  getUsersShips(user) {
    return this.ships.filter(ship => ship.player.isUsers(user));
  }

  serialize() {
    return {
      ships: this.ships.map(ship => ship.serialize())
    };
  }

  deserialize(data = {}) {
    this.ships = data.ships
      ? data.ships.map(shipData => createShipObject(shipData))
      : [];

    return this;
  }
}

export default GameShips;
