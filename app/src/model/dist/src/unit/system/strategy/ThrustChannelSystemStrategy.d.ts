import ShipSystemStrategy from "./ShipSystemStrategy";
import ThrustChannelHeatIncreased from "../criticals/ThrustChannelHeatIncreased";
import { OutputReduced } from "../criticals/index";
import { SystemMessage } from "./types/SystemHandlersTypes";
import { SystemTooltipMenuButton } from "../../ShipSystemHandlers";
import { GAME_PHASE } from "../../../game/gamePhase";
import ShipSystem from "../ShipSystem";
export type SerializedThrustChannelSystemStrategy = {
    thrustChannelSystemStrategy: {
        channeled: number;
        currentMode: string;
        strategies: Record<string, unknown>[];
    };
};
export declare enum THRUSTER_DIRECTION {
    FORWARD = 0,
    AFT = 3,
    STARBOARD_FORWARD = 1,
    STARBOARD_AFT = 2,
    PORT_FORWARD = 4,
    PORT_AFT = 5,
    PIVOT_RIGHT = 6,
    PIVOT_LEFT = 7,
    MANOUVER = 8
}
export declare enum THRUSTER_MODE {
    FUSION = "fusion",
    MANEUVER = "maneuver",
    CHEMICAL = "chemical"
}
export interface IThrustChannelStrategy {
    isBoostable: () => boolean;
    canBoost: () => boolean;
    getFuelRequirement: (amount: number, system: ShipSystem) => number;
    getHeatGenerated: (amount: number, system: ShipSystem) => number;
    getThrustOutput: (system: ShipSystem, boost: number) => number;
    getMessages: (system: ShipSystem) => SystemMessage[];
    getBackgroundImage: (system: ShipSystem) => string;
    advanceTurn(isActive: boolean): void;
    getStrategyName: () => string;
    deserialize: (data: Record<string, unknown>) => void;
    serialize: () => Record<string, unknown>;
    equals: (other: IThrustChannelStrategy) => boolean;
}
declare class ThrustChannelSystemStrategy extends ShipSystemStrategy {
    private direction;
    private channeled;
    private strategies;
    private currentMode;
    private baseOutput;
    constructor(output: number, direction: THRUSTER_DIRECTION | THRUSTER_DIRECTION[], strategies: IThrustChannelStrategy[]);
    isBoostable(payload: unknown, previousResponse?: boolean): boolean;
    canBoost(payload: unknown, previousResponse?: boolean): boolean;
    canChangeMode(): boolean;
    changeMode(): void;
    getFuelRequirement(amount?: number | null): number;
    resetChanneledThrust(): void;
    addChanneledThrust(channel: number): void;
    setChanneledThrust(channel: number): void;
    getChanneledThrust(): number;
    getIconText(): number;
    serialize(payload: unknown, previousResponse?: never[]): SerializedThrustChannelSystemStrategy;
    deserialize(data?: Partial<SerializedThrustChannelSystemStrategy>): this;
    getDirectionString(): string;
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    getBackgroundImage(): string;
    getTooltipMenuButton(payload?: {
        myShip?: boolean;
    }, previousResponse?: never[]): SystemTooltipMenuButton[];
    generatesHeat(): boolean;
    getHeatGenerated(payload: unknown, previousResponse?: number): number;
    getThrustDirection(payload: unknown, previousResponse?: null): THRUSTER_DIRECTION | THRUSTER_DIRECTION[];
    getThrustOutput(payload: undefined, previousResponse?: number): number;
    getMaxChannelAmount(): number;
    canChannelAmount(amount: number): boolean;
    getChannelCost(amount: number): number;
    isThruster(payload: unknown, previousResponse?: boolean): boolean;
    isThrustDirection(direction: THRUSTER_DIRECTION): boolean;
    getRequiredPhasesForReceivingPlayerData(payload: unknown, previousResponse?: GAME_PHASE): GAME_PHASE;
    receivePlayerData({ clientSystem, phase, }: {
        clientSystem: any;
        phase: GAME_PHASE;
    }): void;
    advanceTurn(): void;
    getPossibleCriticals(payload: unknown, previousResponse?: never[]): ({
        severity: number;
        critical: ThrustChannelHeatIncreased;
    } | {
        severity: number;
        critical: OutputReduced;
    })[];
    onSystemOffline(): void;
    onSystemPowerLevelIncrease(): void;
    onSystemPowerLevelDecrease(): void;
}
export default ThrustChannelSystemStrategy;
