import ShipSystemStrategy from "./ShipSystemStrategy";
declare class OutputHeatOnlineStrategy extends ShipSystemStrategy {
    private heatOutput;
    private heatOutputPerBoostLevel;
    private overheatTransferRatio;
    constructor(heatOutput: number, heatOutputPerBoostLevel?: number, overheatTransferRatio?: number);
    getOverheatTransferRatio(payload: unknown, previousResponse?: number): number;
    getMessages(payload: unknown, previousResponse?: never[]): never[];
    generatesHeat(): boolean;
    getHeatGenerated(payload: unknown, previousResponse?: number): number;
}
export default OutputHeatOnlineStrategy;
