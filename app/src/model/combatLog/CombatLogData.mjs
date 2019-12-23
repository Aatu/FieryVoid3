class CombatLogData {
  constructor(gameData) {
    this.gameData = gameData;
    this.entries = [];
  }

  serialize() {}

  deserialize() {}

  advanceTurn() {
    this.entries = [];
  }
}

export default CombatLogData;
