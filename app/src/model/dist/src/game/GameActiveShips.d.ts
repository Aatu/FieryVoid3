import Ship from "../unit/Ship";
import GameData from "./GameData";
declare class GameActiveShips {
    shipIds: string[];
    constructor(gameData: GameData);
    isActive(ship: Ship): boolean;
    setActive(ship: Ship): void;
    setInactive(ship: Ship): void;
    serialize(): string[];
    deserialize(data?: string[]): this;
}
export default GameActiveShips;
