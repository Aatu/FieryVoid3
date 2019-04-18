import GameSlot from "./GameSlot";

class GameSlots {
  constructor(gameData) {
    this.gameData = gameData;
    this.slots = [];
  }

  getSlotById(id) {
    return this.slots[id];
  }

  setSlots(slots) {
    slots.forEach(this.addSlot.bind(this));
  }

  getSlots() {
    return this.slots;
  }

  addSlot(slot) {
    if (slot.id !== null && slot.id !== undefined) {
      this.slots[slot.id] = slot;
    } else {
      const index = this.slots.length;
      slot.id = index;
      this.slots.push(slot);
    }
  }

  serialize() {
    return {
      slots: this.slots.map(slot => slot.serialize())
    };
  }

  deserialize(data = {}) {
    this.slots = data.slots
      ? data.slots.map(slotData => new GameSlot(slotData, this.gameData))
      : [];

    return this;
  }
}

export default GameSlots;
