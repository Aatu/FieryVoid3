import Ship from "../unit/Ship";
import { User } from "../User/User";
import GameData from "./GameData";
import GameSlot, { SerializedGameSlot } from "./GameSlot";
declare class GameSlots {
    private gameData;
    slots: GameSlot[];
    constructor(gameData: GameData);
    getTeamForShip(ship: Ship): number | undefined;
    getSlotsByTeams(): {
        team: number;
        slots: GameSlot[];
    }[];
    isShipInUsersTeam(user: User, ship: Ship): boolean;
    isUsersTeam(user: User, team: number): boolean;
    isUsersTeamSlot(slot: GameSlot, user: User): boolean;
    removeSlot(slot: GameSlot): void;
    getUsersSlots(user: User | null): GameSlot[];
    getSlotByShip(ship: Ship): GameSlot;
    getSlotById(id: string): GameSlot | undefined;
    setSlots(slots: GameSlot[]): void;
    getSlots(): GameSlot[];
    addSlot(slot: GameSlot): GameSlot;
    serialize(): SerializedGameSlot[];
    deserialize(data?: SerializedGameSlot[]): this;
}
export default GameSlots;
