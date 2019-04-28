import GameSlot from "./GameSlot";

class GameSlots {
  constructor(gameData) {
    this.gameData = gameData;
    this.slots = [];
  }

  getSlotsByTeams() {
    const teams = [];

    this.slots.forEach(slot => {
      let team = teams.find(t => t.team === slot.team);

      if (!team) {
        team = {
          team: slot.team,
          slots: [slot]
        };
        teams.push(team);
      } else {
        team.slots.push(slot);
      }
    });

    return teams;
  }

  getSlotById(id) {
    return this.slots.find(slot => slot.id === id);
  }

  setSlots(slots) {
    slots.forEach(this.addSlot.bind(this));
  }

  getSlots() {
    return this.slots;
  }

  addSlot(slot) {
    this.slots.push(slot);
    return slot;
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
