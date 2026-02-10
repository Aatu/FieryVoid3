import ShipSystemStrategy from "./ShipSystemStrategy";
declare class FireOrderHeatStrategy extends ShipSystemStrategy {
    private heatPerShot;
    constructor(heatPerShot: number);
    generatesHeat(): boolean;
    getMessages(payload: unknown, previousResponse?: never[]): never[];
    getHeatGenerated(payload: unknown, previousResponse?: number): number | undefined;
}
export default FireOrderHeatStrategy;
