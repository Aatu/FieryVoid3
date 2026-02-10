import GameData from "../../../../game/GameData";
import { GAME_PHASE } from "../../../../game/gamePhase";
import Ship from "../../../Ship";
import { IShipSystemStrategy } from "../../../ShipSystemHandlers";
import TorpedoFlight from "../../../TorpedoFlight";
import ShipSystem from "../../ShipSystem";
import { TorpedoType } from "../../weapon/ammunition";
import Torpedo from "../../weapon/ammunition/torpedo/Torpedo";
import ShipSystemStrategy from "../ShipSystemStrategy";
type SerializedTorpedoLauncherStrategy = {
    torpedoLauncherSystemStrategy: {
        launchers: SerializedTorpedoLauncher[];
        shotsInMagazine: number;
        turnsOffline: number;
    };
};
export type TorpedoLaunchOptions = {
    systemId: number;
    numberOfReadyLaunchers: number;
    torpedosToLaunch: Torpedo[];
};
export declare class TorpedoLauncherStrategy extends ShipSystemStrategy implements IShipSystemStrategy {
    private torpedoClasses;
    private launchers;
    shotsInMagazine: number;
    magazineSize: number;
    reloadingTime: number;
    turnsOffline: number;
    constructor(torpedoClasses: TorpedoType[], numberOfLaunchers: number, launcherLoadingTime: number, magazineSize: number, reloadingTime: number);
    getTorpedoLaunchOptions(payload: {
        target: Ship;
    }): TorpedoLaunchOptions;
    setLaunchTarget({ target, torpedo, }: {
        target: Ship;
        torpedo: Torpedo;
    }): void;
    launchTorpedos(): TorpedoFlight[];
    advanceTurn(): void;
    serialize(payload: unknown, previousResponse?: Record<string, unknown>): SerializedTorpedoLauncherStrategy;
    deserialize(data?: Partial<SerializedTorpedoLauncherStrategy>): void;
    getLaunchers(): TorpedoLauncher[];
    receivePlayerData({ clientSystem, gameData, phase, }: {
        clientSystem: ShipSystem;
        gameData: GameData;
        phase: GAME_PHASE;
    }): false | undefined;
}
type SerializedTorpedoLauncher = {
    turnsLoaded: number;
    launchTarget: string | null;
    torpedoToLaunch: TorpedoType;
};
declare class TorpedoLauncher {
    private loadingTime;
    private turnsLoaded;
    private launchTarget;
    private torpedoToLaunch;
    constructor(loadingTime: number);
    getLaunchTarget(): string | null;
    getTorpedo(): Torpedo | null;
    advanceTurn(): void;
    setLaunchTarget(target: Ship, torpedo: Torpedo): void;
    launchTorpedo(): void;
    canLaunch(): boolean;
    serialize(): SerializedTorpedoLauncher;
    deserialize(data?: Partial<SerializedTorpedoLauncher>): void;
}
export {};
