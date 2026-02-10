import ShipSystemStrategy from "../ShipSystemStrategy";
import { LoadingTimeIncreased } from "../../criticals/index";
import { SystemMessage } from "../types/SystemHandlersTypes";
type SerializedStandardLoadingStrategy = {
    standardLoadingStrategy: {
        turnsLoaded: number;
    };
};
declare class StandardLoadingStrategy extends ShipSystemStrategy {
    private loadingTime;
    private turnsLoaded;
    private firedThisTurn;
    constructor(loadingTime: number);
    getMessages(payload: unknown, previousResponse?: SystemMessage[]): SystemMessage[];
    private getTurnsUntilLoaded;
    getIconText(payload: undefined, previousResponse?: string): string;
    canFire(payload: unknown, previousResponse?: boolean): boolean;
    usesLoading(): boolean;
    onWeaponFired(): void;
    getLoadingTime(): number;
    getTurnsLoaded(): number;
    isReady(payload: unknown, previousResponse?: null): boolean;
    isLoaded(): boolean;
    serialize(payload: unknown, previousResponse?: never[]): SerializedStandardLoadingStrategy;
    deserialize(data: SerializedStandardLoadingStrategy): this;
    advanceTurn(): void;
    private getBoostLoading;
    getPossibleCriticals(payload: unknown, previousResponse?: never[]): {
        severity: number;
        critical: LoadingTimeIncreased;
    }[];
}
export default StandardLoadingStrategy;
