import GameSlot from "./GameSlot";

class GameSlots {
  constructor(gameData) {
    this.gameData = gameData;
    this.slots = [];
  }

  setSlots(slots) {
    this.slots = slots;
  }

  getSlots() {
    return this.slots;
  }

  addSlot(slot) {
    this.slots.push(slot);
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
