import ShipSystemStrategy from "./ShipSystemStrategy";
export type System_GetMaxEvasion = (payload: unknown, previousResponse: number) => number;
declare class AllowsEvasionSystemStrategy extends ShipSystemStrategy {
    private evasion;
    constructor(evasion: number);
    getMaxEvasion: (payload: unknown, previousResponse?: number) => number;
}
export default AllowsEvasionSystemStrategy;
