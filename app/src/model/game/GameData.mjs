import GameSlots from "./GameSlots.mjs";
import GameShips from "./GameShips.mjs";
import GameActiveShips from "./GameActiveShips.mjs";
import GameTerrain from "./GameTerrain.mjs";
import User from "../User.mjs";
import * as gameStatuses from "./gameStatuses.mjs";
import * as gamePhases from "./gamePhases.mjs";
import GameTorpedos from "./GameTorpedos.mjs";
import CombatLogData from "../combatLog/CombatLogData.mjs";

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

  advanceTurn() {
    this.turn++;
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

  isActiveShip(ship) {
    return this.activeShips.isActive(ship);
  }

  setActiveShip(ship) {
    this.activeShips.setActive(ship);
  }

  setInactiveShip(ship) {
    this.activeShips.setInactive(ship);
  }

  getShipsForUser(user) {
    return this.ships.getShips().filter(ship => ship.player.isUsers(user));
  }

  serialize() {
    return {
      id: this.id,
      phase: this.phase,
      name: this.name,
      turn: this.turn,
      data: {
        activePlayerIds: this.activePlayerIds,
        ...this.slots.serialize(),
        terrain: this.terrain.serialize(),
        combatLog: this.combatLog.serialize(),
        torpedos: this.torpedos.serialize()
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

    this.torpedos = new GameTorpedos().deserialize(gameData.torpedos);
    this.terrain = new GameTerrain(this).deserialize(gameData.terrain);
    this.combatLog = new CombatLogData().deserialize(gameData.combatLog);

    return this;
  }

  clone() {
    return new GameData(this.serialize());
  }

  censorForUser(user) {
    this.ships.getShips().forEach(ship => {
      ship.movement.removeMovementForOtherTurns(this.turn);
      const mine = user && ship.player.is(user);
      ship.censorForUser(user, mine);
    });

    return this;
  }

  endTurn() {
    this.ships.getShips().forEach(ship => {
      ship.endTurn(this.turn);
    });
  }

  advanceTurn() {
    this.turn++;
    this.players.forEach(player => this.setPlayerActive(player));
    this.combatLog.advanceTurn();
    this.torpedos.advanceTurn();

    this.ships.getShips().forEach(ship => {
      ship.advanceTurn(this.turn);
      this.setActiveShip(ship);
    });
  }
}

export default GameData;
