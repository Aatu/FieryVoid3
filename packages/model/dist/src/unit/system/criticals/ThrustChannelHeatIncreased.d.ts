import Critical, { SerializedCritical } from "./Critical";
export type SerializedThrustChannelHeatIncreased = SerializedCritical & {
    heatMultiplier?: number;
};
declare class ThrustChannelHeatIncreased extends Critical {
    private heatMultiplier;
    constructor(heatMultiplier?: number, duration?: number | null);
    serialize(): SerializedThrustChannelHeatIncreased;
    deserialize(data: SerializedThrustChannelHeatIncreased): this;
    getMessage(): string;
    getHeatIncrease(): number;
    excludes(critical: Critical): boolean;
    isReplacedBy(critical: Critical): boolean;
}
export default ThrustChannelHeatIncreased;
