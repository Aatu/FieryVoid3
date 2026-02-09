import { GAME_PHASE } from "../../../game/gamePhase";
import { IShipSystemStrategy, SystemTooltipMenuButton } from "../../ShipSystemHandlers";
import ShipSystem from "../ShipSystem";
import ShipSystemStrategy from "./ShipSystemStrategy";
export type SerializedBoostableSystemStrategy = {
    boostableSystemStrategy: {
        boostLevel: number;
    };
};
declare class BoostableSystemStrategy extends ShipSystemStrategy implements IShipSystemStrategy {
    protected power: number;
    protected maxLevel: number | null;
    protected boostLevel: number;
    constructor(power?: number, maxLevel?: number | null);
    isBoostable(payload: unknown, previousResponse?: boolean): boolean;
    canBoost(payload: unknown, previousResponse?: boolean): boolean;
    canDeBoost(payload: unknown, previousResponse: unknown): boolean;
    getPowerRequiredForBoost(payload: unknown, previousResponse?: number): number;
    getBoost(payload: unknown, previousResponse?: number): number;
    getPowerRequirement(payload: unknown, previousResponse?: number): number;
    boost(payload: unknown, previousResponse: unknown): false | undefined;
    deBoost(payload: unknown, previousResponse: unknown): false | undefined;
    resetBoost(): void;
    getRequiredPhasesForReceivingPlayerData(payload: unknown, previousResponse?: number): number;
    receivePlayerData({ clientSystem, phase, }: {
        clientSystem: ShipSystem;
        phase: GAME_PHASE;
    }): void;
    getTooltipMenuButton(payload?: {
        myShip?: boolean;
    }, previousResponse?: never[]): SystemTooltipMenuButton[];
    serialize(payload: unknown, previousResponse?: {}): SerializedBoostableSystemStrategy;
    deserialize(data: Partial<SerializedBoostableSystemStrategy>): this;
}
export default BoostableSystemStrategy;
