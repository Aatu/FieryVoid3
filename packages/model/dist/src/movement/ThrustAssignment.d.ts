import ShipSystem from "../unit/system/ShipSystem";
import { THRUSTER_DIRECTION } from "../unit/system/strategy/ThrustChannelSystemStrategy";
declare class ThrustAssignment {
    thruster: ShipSystem;
    directions: THRUSTER_DIRECTION[];
    paid: number;
    channeled: number;
    capacity: number;
    assigned: number;
    constructor(thruster: ShipSystem);
    addAssigned(amount: number): void;
    getOverheat(): import("../unit/system/SystemHeat").HeatChangePrediction;
    getFuelRequirement(): number;
    getNextThrustFuelCost(): number;
    isThrustDirection(direction: THRUSTER_DIRECTION): boolean;
    canChannel(): boolean;
    getThrustCapacity(): number;
    channel(amount: number): void;
    undoChannel(amount: number): void;
}
export default ThrustAssignment;
