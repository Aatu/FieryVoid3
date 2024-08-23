import Ship from "../unit/Ship";
import { User } from "../User/User";
import GameData from "./GameData";
import GameSlot, { SerializedGameSlot } from "./GameSlot";

class GameSlots {
  private gameData: GameData;
  public slots: GameSlot[];

  constructor(gameData: GameData) {
    this.gameData = gameData;
    this.slots = [];
  }

  getTeamForShip(ship: Ship) {
    const slot = this.slots.find((slot) => slot.includesShip(ship));

    return slot?.team;
  }

  getSlotsByTeams() {
    const teams: {
      team: number;
      slots: GameSlot[];
    }[] = [];

    this.slots.forEach((slot) => {
      let team = teams.find((t) => t.team === slot.team);

      if (!team) {
        team = {
          team: slot.team,
          slots: [slot],
        };
        teams.push(team);
      } else {
        team.slots.push(slot);
      }
    });

    return teams;
  }

  isShipInUsersTeam(user: User, ship: Ship) {
    const userSlot = this.slots.find((s) => s.userId === user.id);

    if (!userSlot) {
      return false;
    }

    return this.getSlotByShip(ship)?.team === userSlot.team;
  }

  isUsersTeam(user: User, team: number) {
    const userSlot = this.slots.find((s) => s.userId === user.id);

    if (!userSlot) {
      return false;
    }

    return team === userSlot.team;
  }

  isUsersTeamSlot(slot: GameSlot, user: User) {
    const userSlot = this.slots.find((s) => s.userId === user.id);

    if (!userSlot) {
      return false;
    }

    return slot.team === userSlot.team;
  }

  getUsersSlots(user: User | null) {
    return this.slots.filter((slot) => slot.isUsers(user || null));
  }

  getSlotByShip(ship: Ship): GameSlot {
    const slot = this.slots.find((slot) => slot.includesShip(ship));
    if (!slot) {
      throw new Error("ship has no slot");
    }

    return slot;
  }

  getSlotById(id: string) {
    return this.slots.find((slot) => slot.id === id);
  }

  setSlots(slots: GameSlot[]) {
    slots.forEach(this.addSlot.bind(this));
  }

  getSlots() {
    return this.slots;
  }

  addSlot(slot: GameSlot) {
    this.slots.push(slot);
    return slot;
  }

  serialize(): SerializedGameSlot[] {
    return this.slots.map((slot) => slot.serialize());
  }

  deserialize(data: SerializedGameSlot[] = []) {
    this.slots = data
      ? data.map((slotData) => new GameSlot(slotData, this.gameData))
      : [];

    return this;
  }
}

export default GameSlots;
