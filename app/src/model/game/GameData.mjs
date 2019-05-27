import GameSlots from "./GameSlots";
import GameShips from "./GameShips";
import GameActiveShips from "./GameActiveShips";
import User from "../User";
import * as gameStatuses from "./gameStatuses.mjs";
import * as gamePhases from "./gamePhases.mjs";

class GameData {
  constructor(data) {
    this.deserialize(data);
  }

  setStatus(status) {
    this.status = status;
  }

  setPhase(phase) {
    this.phase = phase;
  }

  addPlayer(user) {
    if (this.players.find(player => player.id === user.id)) {
      return;
    }

    this.players.push(user);
  }

  removePlayer(user) {
    this.players = this.players.filter(player => player.id !== user.id);
  }

  isPlayerInGame(user) {
    return this.players.find(player => player.id === user.id);
  }

  isPlayerActive(user) {
    return this.activePlayerIds.includes(user.id);
  }

  setPlayerActive(user) {
    if (this.isPlayerActive(user)) {
      return;
    }

    this.activePlayerIds.push(user.id);
  }

  setPlayerInactive(user) {
    this.activePlayerIds = this.activePlayerIds.filter(id => id !== user.id);
  }

  validateForGameCreate(user) {
    if (!this.name) {
      return "Game needs a name";
    }

    const slots = this.slots.getSlots();

    if (slots.length < 2) {
      return "Game has to have atleast two slots";
    }

    const teams = {};
    slots.forEach(slot => (teams[slot.team] = true));

    if (Object.keys(teams).length < 2) {
      return "Game has to have atleast two teams";
    }

    let error = undefined;

    slots.forEach(slot => {
      const slotError = slot.validate();
      if (slotError) {
        error = slotError;
      }
    });

    if (error) {
      return error;
    }

    if (!slots.some(slot => slot.userId === user.id)) {
      return "Game creator has to occupy atleast one slot";
    }

    if (slots.some(slot => slot.userId && slot.userId !== user.id)) {
      return "Other players can not occupy slots at this stage";
    }
  }

  getActiveShips() {
    return this.ships
      .getShips()
      .filter(ship => this.activeShips.isActive(ship));
  }

  getActiveShipsForUser(user) {
    return this.ships
      .getShips()
      .filter(
        ship => this.activeShips.isActive(ship) && ship.player.isUsers(user)
      );
  }

  serialize() {
    return {
      id: this.id,
      phase: this.phase,
      name: this.name,
      turn: this.turn,
      data: {
        activePlayerIds: this.activePlayerIds,
        ...this.slots.serialize()
      },
      ships: this.ships.serialize(),
      activeShips: this.activeShips.serialize(),
      creatorId: this.creatorId,
      status: this.status,
      players: this.players.map(player => player.serialize())
    };
  }

  deserialize(data = {}) {
    const gameData = data.data || {};
    this.id = data.id || null;
    this.name = data.name;
    this.phase = data.phase || gamePhases.DEPLOYMENT;
    this.turn = data.turn || 1;
    this.players = data.players
      ? data.players.map(player => new User().deserialize(player))
      : [];
    this.activePlayerIds = gameData.activePlayerIds || [];
    this.slots = new GameSlots(this).deserialize(gameData);
    this.ships = new GameShips(this).deserialize(data.ships);
    this.activeShips = new GameActiveShips(this).deserialize(data.activeShips);
    this.creatorId = data.creatorId;
    this.status = data.status || gameStatuses.LOBBY;

    return this;
  }
}

export default GameData;
