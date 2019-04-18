class GameActiveShips {
  constructor(gameData) {
    this.gameData = gameData;
    this.shipsIds = [];
  }

  isActive(ship) {
    return this.shipsIds.includes(ship.id);
  }

  serialize() {
    return this.shipsIds;
  }

  deserialize(data = []) {
    this.shipsIds = data;

    return this;
  }
}

export default GameActiveShips;
