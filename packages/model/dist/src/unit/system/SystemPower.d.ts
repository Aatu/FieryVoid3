import { SerializedPowerEntry } from "./PowerEntry";
import ShipSystem from "./ShipSystem";
export type SerializedSystemPower = {
    entries?: SerializedPowerEntry[];
};
declare class SystemPower {
    private system;
    private entries;
    constructor(system: ShipSystem);
    serialize(): {
        entries: SerializedPowerEntry[];
    };
    deserialize(data?: SerializedSystemPower): this;
    isOffline(): boolean;
    isOnline(): boolean;
    isGoingOnline(): boolean;
    isGoingOffline(): boolean;
    forceOffline(): void;
    setOffline(): void;
    canSetOffline(): false;
    canSetOnline(): false;
    setOnline(): void;
    getPowerOutput(): number;
    getPowerRequirement(): number;
    advanceTurn(turn: number): void;
}
export default SystemPower;
