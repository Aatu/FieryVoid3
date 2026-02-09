import { MovementOrder } from "./index";
import GameTerrain from "../game/GameTerrain";
import GameData from "../game/GameData";
import Ship from "../unit/Ship";
import Vector from "../utils/Vector";
import Offset from "../hexagon/Offset";
import { THRUSTER_DIRECTION } from "../unit/system/strategy/ThrustChannelSystemStrategy";
import { IPhaseDirector } from "../game/IPhaseDirector";
declare class MovementService {
    private gamedata;
    private terrain;
    private phaseDirector;
    constructor();
    update(gamedata: GameData, phaseDirector: IPhaseDirector): this;
    getGameData(): GameData;
    getTerrain(): GameTerrain;
    getPhaseDirector(): IPhaseDirector;
    getNewEndMove(ship: Ship): MovementOrder;
    deploy(ship: Ship, pos: Vector | Offset): void;
    doDeploymentTurn(ship: Ship, step: 1 | -1): void;
    shipStateChanged({ ship }: {
        ship: Ship;
    }): void;
    canThrust(ship: Ship, direction: THRUSTER_DIRECTION): boolean;
    thrust(ship: Ship, direction: THRUSTER_DIRECTION): void;
    canCancel(ship: Ship): boolean;
    canRevert(ship: Ship): boolean;
    cancel(ship: Ship): void;
    revert(ship: Ship): void;
    canPivot(ship: Ship, turnDirection: 1 | -1): boolean;
    pivot(ship: Ship, turnDirection: 1 | -1): boolean;
    canRoll(ship: Ship): boolean;
    roll(ship: Ship): boolean;
    canEvade(ship: Ship, step: 1 | -1): boolean;
    evade(ship: Ship, step: 1 | -1): boolean;
}
export default MovementService;
