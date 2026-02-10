import BoostableSystemStrategy from "./BoostableSystemStrategy";
declare class BoostablePlusOneOutputSystemStrategy extends BoostableSystemStrategy {
    basePowerRequirement: number | null;
    constructor(maxLevel?: number | null, basePowerRequirement?: number | null);
    getPowerRequiredForBoost(payload: unknown, previousResponse?: number): number;
    getPowerRequirement(payload: undefined, previousResponse?: number): number;
}
export default BoostablePlusOneOutputSystemStrategy;
