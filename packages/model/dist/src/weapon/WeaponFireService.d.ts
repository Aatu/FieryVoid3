import GameData from "../game/GameData";
import Ship from "../unit/Ship";
import ShipSystem from "../unit/system/ShipSystem";
import Weapon from "../unit/system/weapon/Weapon";
import FireOrder from "./FireOrder";
declare class WeaponFireService {
    private gamedata;
    getGameData(): GameData;
    update(gamedata: GameData): this;
    getAllFireOrders(): FireOrder[];
    getFireOrderById(id: string): FireOrder;
    getAllFireOrdersForShip(shooter: Ship): FireOrder[];
    systemHasFireOrder(system: ShipSystem): boolean;
    getSystemFireOrderTargetId(system: ShipSystem): string | null;
    systemHasFireOrderAgainstShip(system: ShipSystem, target: Ship): boolean;
    addFireOrder(shooter: Ship, target: Ship, weapon: ShipSystem): FireOrder[];
    removeFireOrders(shooter: Ship, weapon: Weapon): void;
    canFire(shooter: Ship, target: Ship, weapon: Weapon): boolean;
}
export default WeaponFireService;
