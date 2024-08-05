class GameActiveShips {
  constructor(gameData) {
    this.gameData = gameData;
    this.shipIds = [];
  }

  isActive(ship) {
    return this.shipIds.includes(ship.id);
  }

  setActive(ship) {
    if (this.isActive(ship)) {
      return;
    }

    this.shipIds.push(ship.id);
  }

  setInactive(ship) {
    this.shipIds = this.shipIds.filter(id => id !== ship.id);
  }

  serialize() {
    return this.shipIds;
  }

  deserialize(data = []) {
    this.shipIds = data;

    return this;
  }
}

export default GameActiveShips;
