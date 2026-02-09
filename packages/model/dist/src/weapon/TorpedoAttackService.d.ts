import GameData from "../game/GameData";
import Ship from "../unit/Ship";
import { TorpedoLauncherStrategy, TorpedoLaunchOptions } from "../unit/system/strategy/weapon/TorpedoLauncherStrategy";
import TorpedoFlight from "../unit/TorpedoFlight";
import { User } from "../User/User";
declare class TorpedoAttackService {
    private gameData;
    update(gameData: GameData): this;
    getGameData(): GameData;
    getPossibleInterceptors(ship: Ship, torpedoFlight: TorpedoFlight): import("../unit/system/ShipSystem").default[];
    getTorpedoLaunchOptions(ship: Ship, target: Ship): TorpedoLaunchOptions[];
    getPossibleTorpedos(currentUser: User, target: Ship): {
        ship: Ship;
        launchers: TorpedoLauncherStrategy[];
        distance: number;
        deltaDistance: number;
    }[];
}
export default TorpedoAttackService;
