import ShipSystem from "./ShipSystem";
export type SerializedSystemHeat = {
    heat?: number;
    overheat?: number;
};
export type HeatChangePrediction = {
    overheat: number;
    newHeat: number;
    overheatPercentage: number;
    cooling: number;
    coolingPercent: number;
    overHeatThreshold: number;
    maximumPossibleOverheatReduction: number;
    maxCooling: number;
};
declare class SystemHeat {
    private system;
    private heat;
    private overheat;
    private heatTransferPerStructure;
    private overheatLimitPerStructure;
    private overheatTransferRatio;
    private heatTransferred;
    constructor(system: ShipSystem);
    serialize(): {
        heat: number;
        overheat: number;
    };
    deserialize(data?: SerializedSystemHeat): this;
    getHeatTransferred(): number;
    getHeatTransferPerStructure(): number;
    getHeat(): number;
    getMaxTransferHeat(): number;
    getOverheatTransferRatio(): number;
    getTransferOverHeat(): number;
    getTransferHeat(): number;
    getHeatGenerated(): number;
    getHeatPerStructure(): number;
    shouldDisplayHeat(): boolean;
    predictHeatChange(): HeatChangePrediction;
    generateHeat(): number;
    isHeatStorage(): boolean;
    getMaxHeatStoreCapacity(): number;
    getHeatStoreCapacity(): number;
    changeHeat(change: number): this;
    markNewOverheat(): void;
    getOverheat(): number;
    getOverheatTreshold(): number;
    getOverheatPercentage(extra?: number): number;
    getRadiateHeatCapacity(): number;
    radiateHeat(heat: number): undefined;
    advanceTurn(turn: number): void;
}
export default SystemHeat;
