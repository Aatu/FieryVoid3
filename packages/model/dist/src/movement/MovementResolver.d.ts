import Ship from "../unit/Ship";
import { MovementService, ThrustBill } from "./index";
declare class MovementResolver {
    ship: Ship;
    movementService: MovementService;
    turn: number;
    constructor(ship: Ship, movementService: MovementService, turn: number);
    billAndPay(bill: ThrustBill, commit?: boolean): boolean;
    canRoll(): boolean;
    roll(commit?: boolean): boolean;
    canEvade(step: number): boolean;
    evade(step: number, commit?: boolean): boolean;
    canPivot(pivotDirection: 1 | -1): boolean;
    pivot(pivotDirection: 1 | -1, commit?: boolean): boolean;
    canThrust(direction: number): boolean;
    thrust(direction: number, commit?: boolean): boolean;
    canCancel(): boolean;
    cancel(): boolean | undefined;
    canRevert(): boolean;
    revert(): void;
}
export default MovementResolver;
