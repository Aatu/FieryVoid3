import Ship from "./Ship";
import { InterceptionPriority } from "./TorpedoFlight";
export type SerializedShipTorpedoDefense = {
    minHitChangeLowPriority: number;
    minHitChangeMediumPriority: number;
    minHitChangeHighPriority: number;
    otherShipInterceptionMod: number;
};
export declare class ShipTorpedoDefense {
    minHitChangeLowPriority: number;
    minHitChangeMediumPriority: number;
    minHitChangeHighPriority: number;
    otherShipInterceptionMod: number;
    constructor(args?: Partial<SerializedShipTorpedoDefense>);
    deserialize(args?: Partial<SerializedShipTorpedoDefense>): void;
    serialize(): SerializedShipTorpedoDefense;
    receivePlayerData(clientShip: Ship): void;
    canIntercept(interceptionPriority: InterceptionPriority, targetsThisShip: boolean, hitChance: number): boolean;
}
