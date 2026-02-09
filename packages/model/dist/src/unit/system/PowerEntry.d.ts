export declare enum POWER_TYPE {
    OFFLINE = "offline",
    BOOST = "boost",
    GO_OFFLINE = "go-offline",
    GO_ONLINE = "go-online"
}
export type SerializedPowerEntry = {
    type: POWER_TYPE;
    amount: number;
};
declare class PowerEntry {
    type: POWER_TYPE;
    amount: number;
    constructor(powerType?: POWER_TYPE, amount?: number);
    isOffline(): boolean;
    isGoingOffline(): boolean;
    isGoingOnline(): boolean;
    isBoost(): boolean;
    getAmount(): number;
    setAmount(amount: number): void;
    serialize(): SerializedPowerEntry;
    deserialize(data: SerializedPowerEntry): this;
}
export default PowerEntry;
