import Ship from "../unit/Ship";
import { THRUSTER_DIRECTION } from "../unit/system/strategy/ThrustChannelSystemStrategy";
import { MovementOrder, ThrustAssignment } from "./index";
declare class ThrustBill {
    private ship;
    private movement;
    private thrusters;
    private fuel;
    private paid;
    private directionsRequired;
    constructor(ship: Ship, movement: MovementOrder[]);
    getRequiredThrustDirections(): {
        0: number;
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
        6: number;
        7: number;
        8: number;
    };
    getTotalThrustRequired(): number;
    getCurrentThrustRequired(): number;
    isPaid(): boolean;
    totalFuelRequirement(): number;
    getAllUsableThrusters(direction: THRUSTER_DIRECTION): ThrustAssignment[];
    sortThrusters(a: ThrustAssignment, b: ThrustAssignment): 1 | -1 | 0;
    pay(): boolean;
    process(): boolean;
    useThrusters(direction: THRUSTER_DIRECTION, required: number): void;
    buildRequiredThrust(movement: MovementOrder[]): void;
    getMoves(): MovementOrder[];
}
export default ThrustBill;
