import ShipSystemStrategy from "./ShipSystemStrategy";
declare class StoreHeatStrategy extends ShipSystemStrategy {
    private heatCapacity;
    constructor(heatCapacity: number);
    getMessages(payload: unknown, previousResponse?: never[]): ({
        header: string;
        value: string;
    } | {
        header: string;
        value: number;
    })[];
    canStoreHeat(): boolean;
    getHeatStoreAmount(payload: unknown, previousResponse?: number): number;
}
export default StoreHeatStrategy;
