import ShipSystemStrategy from "../ShipSystemStrategy";
import FireOrder, { SerializedFireOrder } from "../../../../weapon/FireOrder";
import GameData from "../../../../game/GameData";
import Ship from "../../../Ship";
export type SerializedFireOrderStrategy = {
    fireOrderStrategy?: SerializedFireOrder[];
};
declare class FireOrderStrategy extends ShipSystemStrategy {
    private resolutionPriority;
    private fireOrders;
    constructor(resolutionPriority?: number);
    executeFireOrders({ gameData }: {
        gameData: GameData;
    }): void;
    usesFireOrders(): boolean;
    getFireOrderResolutionPriority(): number;
    hasFireOrder(): boolean;
    getFireOrders(): FireOrder[];
    removeFireOrders(): void;
    addFireOrder({ shooter, target, weaponSettings, }: {
        shooter: Ship;
        target: Ship;
        weaponSettings: Record<string, unknown>;
    }): FireOrder[];
    serialize(payload: unknown, previousResponse?: never[]): SerializedFireOrderStrategy;
    deserialize(data?: SerializedFireOrderStrategy): this;
    advanceTurn(turn: number): void;
    censorForUser({ mine }: {
        mine: boolean;
    }): void;
    onSystemOffline(): void;
}
export default FireOrderStrategy;
