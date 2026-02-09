import ShipSystemStrategy from "./ShipSystemStrategy";
import { CriticalTableEntry } from "../criticals/index";
declare class ThrustOutputSystemStrategy extends ShipSystemStrategy {
    private output;
    constructor(output: number);
    getOutputForBoost(payload: unknown, previousResponse?: number): number;
    getThrustOutput(payload: unknown, previousResponse?: number): number;
    getPossibleCriticals(payload: unknown, previousResponse?: never[]): CriticalTableEntry[];
    onSystemOffline(): void;
    onSystemPowerLevelDecrease(): void;
}
export default ThrustOutputSystemStrategy;
