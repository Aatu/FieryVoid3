import GameSlot from "./GameSlot.mjs";

class GameSlots {
  constructor(gameData) {
    this.gameData = gameData;
    this.slots = [];
  }

  getTeamForShip(ship) {
    const slot = this.slots.find(slot => slot.includesShip(ship));

    return slot.team;
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

  isUsersTeamSlot(slot, user) {
    const userSlot = this.slots.find(s => s.userId === user);

    if (!userSlot) {
      return false;
    }

    return slot.team === userSlot.team;
  }

  getUsersSlots(user) {
    return this.slots.filter(slot => slot.isUsers(user));
  }

  getSlotByShip(ship) {
    return this.slots.find(slot => slot.includesShip(ship));
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
