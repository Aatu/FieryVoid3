import Ship from "../unit/Ship";
import ShipSystem from "../unit/system/ShipSystem";
import { THRUSTER_DIRECTION } from "../unit/system/strategy/ThrustChannelSystemStrategy";
import MovementOrder from "./MovementOrder";
type ThrustFulfilment = {
    amount: number;
    thrusterId: number;
};
type ThrustFulfilments = {
    [THRUSTER_DIRECTION.FORWARD]: ThrustFulfilment[];
    [THRUSTER_DIRECTION.STARBOARD_FORWARD]: ThrustFulfilment[];
    [THRUSTER_DIRECTION.STARBOARD_AFT]: ThrustFulfilment[];
    [THRUSTER_DIRECTION.AFT]: ThrustFulfilment[];
    [THRUSTER_DIRECTION.PORT_FORWARD]: ThrustFulfilment[];
    [THRUSTER_DIRECTION.PORT_AFT]: ThrustFulfilment[];
    [THRUSTER_DIRECTION.PIVOT_RIGHT]: ThrustFulfilment[];
    [THRUSTER_DIRECTION.PIVOT_LEFT]: ThrustFulfilment[];
    [THRUSTER_DIRECTION.MANOUVER]: ThrustFulfilment[];
};
export type SerializedRequiredThrust = {
    requirements?: Record<number, number>;
    fullfilments?: ThrustFulfilments;
};
declare class RequiredThrust {
    requirements: Record<number, number>;
    fullfilments: ThrustFulfilments;
    constructor();
    calculate(ship: Ship, move: MovementOrder): this;
    serialize(): SerializedRequiredThrust;
    deserialize(data?: SerializedRequiredThrust): this;
    getTotalAmountRequired(): number;
    getRequirement(direction: THRUSTER_DIRECTION): number;
    isFulfilled(): boolean;
    fulfill(direction: THRUSTER_DIRECTION, amount: number, thruster: ShipSystem): void;
    getFulfilledAmount(direction: THRUSTER_DIRECTION): number;
    getFulfilments(): ThrustFulfilment[][];
    requireRoll(ship: Ship): void;
    requireEvade(ship: Ship, move: MovementOrder): void;
    requirePivot(ship: Ship, move: MovementOrder): void;
    requireSpeed(ship: Ship, move: MovementOrder): void;
    accumulate(total: ThrustRequirementSummary): ThrustRequirementSummary;
}
export type ThrustRequirementSummary = {
    [THRUSTER_DIRECTION.FORWARD]: number;
    [THRUSTER_DIRECTION.STARBOARD_FORWARD]: number;
    [THRUSTER_DIRECTION.STARBOARD_AFT]: number;
    [THRUSTER_DIRECTION.AFT]: number;
    [THRUSTER_DIRECTION.PORT_FORWARD]: number;
    [THRUSTER_DIRECTION.PORT_AFT]: number;
    [THRUSTER_DIRECTION.PIVOT_RIGHT]: number;
    [THRUSTER_DIRECTION.PIVOT_LEFT]: number;
    [THRUSTER_DIRECTION.MANOUVER]: number;
};
export default RequiredThrust;
