import ShipSystemStrategy from "./ShipSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";
interface SerializedAlwaysTargetableSystemStrategy {
    turnsOffline: number;
}
declare class AlwaysTargetableSystemStrategy extends ShipSystemStrategy {
    private turnsOfflineToCancel;
    private turnsOffline;
    constructor(turnsOfflineToCancel?: number | null);
    isAlwaysTargetable: (_: unknown, previousResponse?: boolean) => boolean;
    serialize: (payload: unknown, previousResponse?: Record<string, unknown>) => typeof previousResponse & {
        alwaysTargetableSystemStrategy: SerializedAlwaysTargetableSystemStrategy;
    };
    deserialize(data?: {
        alwaysTargetableSystemStrategy?: SerializedAlwaysTargetableSystemStrategy;
    }): this;
    getMessages: (_: unknown, previousResponse?: SystemMessage[]) => SystemMessage[];
    advanceTurn(): void;
}
export default AlwaysTargetableSystemStrategy;
