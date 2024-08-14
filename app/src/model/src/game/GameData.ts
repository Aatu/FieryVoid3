import GameSlots from "./GameSlots";
import GameShips from "./GameShips";
import GameActiveShips from "./GameActiveShips";
import GameTerrain, { SerializedGameTerrain } from "./GameTerrain";
import GameTorpedos, { SerializedGameTorpedos } from "./GameTorpedos";
import CombatLogData, {
  SerializedCombatLogData,
} from "../combatLog/CombatLogData";
import { GAME_STATUS } from "./gameStatus";
import { GAME_PHASE } from "./gamePhase";
import { IUser, User } from "../User/User";
import Ship, { SerializedShip } from "../unit/Ship";
import { SerializedGameSlot } from "./GameSlot";

export type SerializedGameDataSubData = {
  activePlayerIds?: number[];
  terrain?: SerializedGameTerrain;
  combatLog?: SerializedCombatLogData;
  torpedos?: SerializedGameTorpedos;
  slots?: SerializedGameSlot[];
};

export type SerializedGameData = {
  id?: number;
  phase?: GAME_PHASE;
  name?: string;
  turn?: number;
  data?: SerializedGameDataSubData;
  ships: SerializedShip[];
  activeShips?: string[];
  creatorId?: number;
  status?: GAME_STATUS;
  players: IUser[];
};

class GameData {
  public status!: GAME_STATUS;
  public id!: number | null;
  public phase!: GAME_PHASE;
  public players: User[] = [];
  public activePlayerIds: number[] = [];
  public ships!: GameShips;
  public name!: string | undefined;
  public slots!: GameSlots;
  public turn!: number;
  public creatorId!: number;
  public terrain!: GameTerrain;
  public combatLog!: CombatLogData;
  public torpedos!: GameTorpedos;
  public activeShips!: GameActiveShips;

  constructor(data?: SerializedGameData) {
    this.deserialize(data);
  }

  getId(): number {
    if (!this.id) {
      throw new Error("Game does not have an id");
    }
    return this.id;
  }

  setStatus(status: GAME_STATUS) {
    this.status = status;
  }

  setPhase(phase: GAME_PHASE) {
    this.phase = phase;
  }

  addPlayer(user: User) {
    if (this.players.find((player) => player.id === user.id)) {
      return;
    }

    this.players.push(user);
  }

  removePlayer(user: User) {
    this.players = this.players.filter((player) => player.id !== user.id);
  }

  isPlayerInGame(user: User) {
    return this.players.find((player) => player.id === user.id);
  }

  isPlayerActive(user: User): Boolean {
    return this.activePlayerIds.includes(user.id);
  }

  setPlayerActive(user: User, requireShips = false) {
    if (this.isPlayerActive(user)) {
      return;
    }

    if (requireShips && this.ships.getUsersShips(user).length === 0) {
      return;
    }

    this.activePlayerIds.push(user.id);
  }

  setPlayerInactive(user: User) {
    this.activePlayerIds = this.activePlayerIds.filter((id) => id !== user.id);
  }

  validateForGameCreate(user: User) {
    if (!this.name) {
      return "Game needs a name";
    }

    const slots = this.slots.getSlots();

    if (slots.length < 2) {
      return "Game has to have atleast two slots";
    }

    const teams: Record<number, boolean> = {};
    slots.forEach((slot) => (teams[slot.team] = true));

    if (Object.keys(teams).length < 2) {
      return "Game has to have atleast two teams";
    }

    let error = undefined;

    slots.forEach((slot) => {
      const slotError = slot.validate();
      if (slotError) {
        error = slotError;
      }
    });

    if (error) {
      return error;
    }

    if (!slots.some((slot) => slot.userId === user.id)) {
      return "Game creator has to occupy atleast one slot";
    }

    if (slots.some((slot) => slot.userId && slot.userId !== user.id)) {
      return "Other players can not occupy slots at this stage";
    }
  }

  getActiveShips() {
    return this.ships
      .getShips()
      .filter((ship) => this.activeShips.isActive(ship));
  }

  getActiveShipsForUser(user: User) {
    return this.ships
      .getShips()
      .filter(
        (ship) =>
          this.activeShips.isActive(ship) && ship.getPlayer().isUsers(user)
      );
  }

  isActiveShip(ship: Ship) {
    return this.activeShips.isActive(ship);
  }

  setActiveShip(ship: Ship) {
    this.activeShips.setActive(ship);
  }

  setInactiveShip(ship: Ship) {
    this.activeShips.setInactive(ship);
  }

  getShipsForUser(user: User) {
    return this.ships
      .getShips()
      .filter((ship) => ship.getPlayer().isUsers(user));
  }

  serialize(): SerializedGameData {
    return {
      id: this.id || undefined,
      phase: this.phase,
      name: this.name,
      turn: this.turn,
      data: {
        activePlayerIds: this.activePlayerIds,
        slots: this.slots.serialize(),
        terrain: this.terrain.serialize(),
        combatLog: this.combatLog.serialize(),
        torpedos: this.torpedos.serialize(),
      },
      ships: this.ships.serialize(),
      activeShips: this.activeShips.serialize(),
      creatorId: this.creatorId,
      status: this.status,
      players: this.players.map((player) => player.serialize()),
    };
  }

  deserialize(data: SerializedGameData = { players: [], ships: [] }) {
    const gameData = data.data || {};
    this.id = data.id || null;
    this.name = data.name;
    this.phase = data.phase || GAME_PHASE.DEPLOYMENT;
    this.turn = data.turn || 1;
    this.players = data.players
      ? data.players.map((player) => new User(player))
      : [];
    this.activePlayerIds = gameData.activePlayerIds || [];
    this.slots = new GameSlots(this).deserialize(gameData.slots);
    this.ships = new GameShips(this).deserialize(data.ships);
    this.activeShips = new GameActiveShips(this).deserialize(data.activeShips);
    this.creatorId = data.creatorId || 0;
    this.status = data.status || GAME_STATUS.LOBBY;

    this.torpedos = new GameTorpedos().deserialize(gameData.torpedos);
    this.terrain = new GameTerrain(this).deserialize(gameData.terrain);
    this.combatLog = new CombatLogData().deserialize(gameData.combatLog);

    return this;
  }

  clone() {
    return new GameData(this.serialize());
  }

  censorForUser(user: User | null) {
    this.ships.getShips().forEach((ship) => {
      ship.movement.removeMovementForOtherTurns(this.turn);
      const mine = Boolean(user && ship.getPlayer().is(user));
      ship.censorForUser(user, mine, this.turn);
    });

    return this;
  }

  getAiUsers() {
    return this.slots.slots
      .filter((slot) => slot.userId !== null && slot.userId < 0)
      .map((slot) => this.players.find((player) => player.id === slot.userId))
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  endTurn() {
    this.ships.getShips().forEach((ship) => {
      ship.endTurn(this.turn);
    });
  }

  advanceTurn() {
    this.turn++;
    this.players.forEach((player) => this.setPlayerActive(player, true));
    this.combatLog.advanceTurn();
    this.torpedos.advanceTurn();

    this.ships
      .getShips()
      .filter((ship) => !ship.isDestroyed())
      .forEach((ship) => {
        ship.advanceTurn(this.turn);
        this.setActiveShip(ship);
      });

    this.ships
      .getShips()
      .filter((ship) => ship.isDestroyed())
      .forEach((ship) => {
        ship.destroyedThisTurn = false;
      });
  }
}

export default GameData;
