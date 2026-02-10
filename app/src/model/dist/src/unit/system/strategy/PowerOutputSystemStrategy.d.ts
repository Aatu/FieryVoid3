import ShipSystemStrategy from "./ShipSystemStrategy";
import { OutputReduced2 } from "../criticals/index";
import { SystemMessage } from "./types/SystemHandlersTypes";
declare class PowerOutputSystemStrategy extends ShipSystemStrategy {
    private output;
    constructor(output: number);
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    getPowerOutput(payload: unknown, previousResponse?: number): number;
    getPossibleCriticals(payload: unknown, previousResponse?: never[]): {
        weight: number;
        className: typeof OutputReduced2;
    }[];
}
export default PowerOutputSystemStrategy;
