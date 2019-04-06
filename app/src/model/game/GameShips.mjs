import createShipObject from "../unit/createShipObject";

class GameShips {
  constructor(gameData) {
    this.gameData = gameData;
    this.ships = [];
  }

  addShip(ship) {
    this.ships.push(ship);
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
