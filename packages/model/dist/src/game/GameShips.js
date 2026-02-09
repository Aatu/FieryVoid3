import { createShipObject } from "../unit/createShipObject";
class GameShips {
    gameData;
    ships = [];
    constructor(gameData) {
        this.gameData = gameData;
        this.ships = [];
    }
    isSameTeam(shipA, shipB) {
        return (this.gameData.slots.getTeamForShip(shipA) ===
            this.gameData.slots.getTeamForShip(shipB));
    }
    addShip(ship) {
        if (ship.id && this.hasShipById(ship.id)) {
            throw new Error(`Duplicate ship is added to gamedata id: "${ship.id}"`);
        }
        this.ships.push(ship);
        return this;
    }
    removeShip(ship) {
        this.ships = this.ships.filter((s) => s.id !== ship.id);
    }
    getShips() {
        return this.ships;
    }
    getAliveShips() {
        return this.ships.filter((ship) => !ship.isDestroyed());
    }
    hasShipById(id) {
        return Boolean(this.ships.find((ship) => ship.id === id));
    }
    getShipById(id) {
        const ship = this.ships.find((ship) => ship.id === id);
        if (!ship) {
            throw new Error(`Ship with id ${id} not found`);
        }
        return ship;
    }
    getUsersShips(user) {
        return this.ships.filter((ship) => ship.getPlayer().isUsers(user) && !ship.isDestroyed());
    }
    getShipsInSameTeam(user) {
        const slot = this.gameData.slots.getUsersSlots(user);
        if (!slot || slot.length === 0) {
            return [];
        }
        const team = slot[0].team;
        return this.ships.filter((ship) => this.gameData.slots.getSlotByShip(ship)?.team === team &&
            !ship.isDestroyed());
    }
    getShipsEnemyTeams(user) {
        const teamShips = this.getShipsInSameTeam(user);
        return this.ships.filter((ship) => !teamShips.includes(ship) && !ship.isDestroyed());
    }
    serialize() {
        return this.ships.map((ship) => ship.serialize());
    }
    deserialize(ships = []) {
        this.ships = ships.map((shipData) => createShipObject(shipData));
        return this;
    }
    setShipLoadouts() {
        this.getShips().forEach((ship) => ship.setShipLoadout());
    }
}
export default GameShips;
