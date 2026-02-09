import Vector from "../utils/Vector";
import Torpedo from "./system/weapon/ammunition/torpedo/Torpedo";
import Ship from "./Ship";
import { TorpedoType } from "./system/weapon/ammunition";
export type SerializedTorpedoFlight = {
    id: string;
    torpedo: TorpedoType;
    targetId: string;
    strikePosition: Vector;
    shooterId: string;
    weaponId: number;
    intercepted: boolean;
    launchPosition: Vector;
};
export declare enum InterceptionPriority {
    HIGH = 1,
    MEDIUM = 2,
    LOW = 3
}
declare class TorpedoFlight {
    id: string;
    torpedo: Torpedo;
    targetId: string;
    shooterId: string;
    weaponId: number;
    launchPosition: Vector;
    strikePosition: Vector;
    intercepted: boolean;
    done: boolean;
    interceptionPriority: InterceptionPriority;
    pathStartIndex: number;
    constructor(torpedo: Torpedo, targetId: string, shooterId: string, weaponId: number);
    randomizeStartIndex(): void;
    getTargetId(): string;
    getShooterId(): string;
    setDone(): void;
    isDone(): boolean;
    isIntercepted(): boolean;
    setIntercepted(): void;
    getStrikeDistance(target: Ship): number;
    setStrikePosition(position: Vector): this;
    getStrikePositionHex(): import("../hexagon").Offset;
    setLaunchPosition(position: Vector): this;
    serialize(): SerializedTorpedoFlight;
    deserialize(data: SerializedTorpedoFlight): this;
    static fromData(data: SerializedTorpedoFlight): TorpedoFlight;
    clone(): TorpedoFlight;
}
export default TorpedoFlight;
