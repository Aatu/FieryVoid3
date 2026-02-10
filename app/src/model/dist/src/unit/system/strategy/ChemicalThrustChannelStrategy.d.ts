import ShipSystem from "../ShipSystem";
import { IThrustChannelStrategy } from "./ThrustChannelSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";
export type ChemicalThrusterArgs = {
    output: number;
    fuelPerThrust: number;
    heatPerThrust: number;
};
export declare class ChemicalThrustChannelStrategy implements IThrustChannelStrategy {
    private thrusterArgs;
    constructor(args: ChemicalThrusterArgs);
    isBoostable(): boolean;
    canBoost(): boolean;
    getMessages(system: ShipSystem): SystemMessage[];
    equals(other: IThrustChannelStrategy): boolean;
    getBackgroundImage(system: ShipSystem): string;
    advanceTurn(isActive: boolean): void;
    getStrategyName(): string;
    deserialize(data: Record<string, unknown>): void;
    serialize(): {};
    getFuelRequirement(amount: number): number;
    generatesHeat(): boolean;
    private getHeatPerThrustChanneled;
    getHeatGenerated(channeled: number, system: ShipSystem): number;
    getThrustOutput(system: ShipSystem): number;
    getMaxChannelAmount(system: ShipSystem): number;
    canChannelAmount(amount: number, system: ShipSystem): boolean;
    getChannelCost(amount: number): number;
}
