import GameSlot from "./GameSlot";

class GameSlots {
  constructor(gameData) {
    this.gameData = gameData;
    this.slots = [];
  }

  serialize() {
    return {
      slots: this.slots.map(slot => slot.serialize())
    };
  }

  deserialize(data = {}) {
    this.slots = data.slots
      ? data.slots.map(slotData => new GameSlot(slotData))
      : [];

    return this;
  }
}

export default GameSlots;
