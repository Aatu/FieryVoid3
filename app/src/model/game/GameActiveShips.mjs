class GameActiveShips {
  constructor(gameData) {
    this.gameData = gameData;
    this.shipsIds = [];
  }

  serialize() {
    return {
      shipsIds: this.shipsIds
    };
  }

  deserialize(data = {}) {
    this.shipsIds = data.shipsIds;
  }
}

export default GameActiveShips;
