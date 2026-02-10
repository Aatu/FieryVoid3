import GameSlots from "./GameSlots";
import GameShips from "./GameShips";
import GameActiveShips from "./GameActiveShips";
import GameTerrain from "./GameTerrain";
import GameTorpedos from "./GameTorpedos";
import CombatLogData from "../combatLog/CombatLogData";
import { GAME_STATUS } from "./gameStatus";
import { GAME_PHASE } from "./gamePhase";
import { User } from "../User/User";
class GameData {
    status;
    id;
    phase;
    players = [];
    activePlayerIds = [];
    ships;
    name;
    slots;
    turn;
    creatorId;
    terrain;
    combatLog;
    torpedos;
    activeShips;
    constructor(data) {
        this.deserialize(data);
    }
    getId() {
        if (!this.id) {
            throw new Error("Game does not have an id");
        }
        return this.id;
    }
    setStatus(status) {
        this.status = status;
    }
    setPhase(phase) {
        this.phase = phase;
    }
    addPlayer(user) {
        if (this.players.find((player) => player.id === user.id)) {
            return;
        }
        this.players.push(user);
    }
    removePlayer(user) {
        this.players = this.players.filter((player) => player.id !== user.id);
    }
    isPlayerInGame(user) {
        return this.players.find((player) => player.id === user.id);
    }
    isPlayerActive(user) {
        return this.activePlayerIds.includes(user.id);
    }
    setPlayerActive(user, requireShips = false) {
        if (this.isPlayerActive(user)) {
            return;
        }
        if (requireShips && this.ships.getUsersShips(user).length === 0) {
            return;
        }
        this.activePlayerIds.push(user.id);
    }
    setPlayerInactive(user) {
        this.activePlayerIds = this.activePlayerIds.filter((id) => id !== user.id);
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
    getActiveShipsForUser(user) {
        return this.ships
            .getShips()
            .filter((ship) => this.activeShips.isActive(ship) && ship.getPlayer().isUsers(user));
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
        return this.ships
            .getShips()
            .filter((ship) => ship.getPlayer().isUsers(user));
    }
    serialize() {
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
    deserialize(data = { players: [], ships: [] }) {
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
    censorForUser(user) {
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
            ship.advanceTurn(this);
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
