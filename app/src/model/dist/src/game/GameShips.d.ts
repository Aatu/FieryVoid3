import Ship, { SerializedShip } from "../unit/Ship";
import { User } from "../User/User";
import GameData from "./GameData";
declare class GameShips {
    private gameData;
    private ships;
    constructor(gameData: GameData);
    isSameTeam(shipA: Ship, shipB: Ship): boolean;
    addShip(ship: Ship): this;
    removeShip(ship: Ship): void;
    getShips(): Ship[];
    getAliveShips(): Ship[];
    hasShipById(id: string): boolean;
    getShipById(id: string): Ship;
    getUsersShips(user: User | null): Ship[];
    getShipsInSameTeam(user: User | null): Ship[];
    getShipsEnemyTeams(user: User | null): Ship[];
    serialize(): SerializedShip[];
    deserialize(ships?: SerializedShip[]): this;
    setShipLoadouts(): void;
}
export default GameShips;
