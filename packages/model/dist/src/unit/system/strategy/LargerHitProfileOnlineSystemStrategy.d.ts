import ShipSystemStrategy from "./ShipSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";
export type SerializedLargerHitProfileOnlineSystemStrategy = {
    largerHitProfileOnlineSystemStrategy?: {
        turnsOffline?: number;
    };
};
declare class LargerHitProfileOnlineSystemStrategy extends ShipSystemStrategy {
    private front;
    private side;
    private hitSizeMultiplier;
    private turnsOffline;
    constructor(front: number, side: number, hitSizeMultiplier?: number);
    serialize(payload: unknown, previousResponse?: never[]): SerializedLargerHitProfileOnlineSystemStrategy;
    deserialize(data?: SerializedLargerHitProfileOnlineSystemStrategy): this;
    getHitSystemSizeMultiplier(payload: unknown, previousResponse?: number): number;
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    getHitProfile({ front }: {
        front?: boolean | undefined;
    }, previousResponse?: number): number;
    advanceTurn(): void;
    onGameStart(): void;
}
export default LargerHitProfileOnlineSystemStrategy;
