import Critical, { SerializedCritical } from "./Critical";
export type SerializedLoadingTimeIncreased = SerializedCritical & {
    loadingTimeIncrease: number;
};
declare class LoadingTimeIncreased extends Critical {
    private loadingTimeIncrease;
    constructor(duration: number | null, loadingTimeIncrease: number);
    serialize(): SerializedLoadingTimeIncreased;
    deserialize(data: SerializedLoadingTimeIncreased): this;
    getMessage(): string;
    getLoadingTimeIncrease(): number;
    excludes(critical: Critical): boolean;
    isReplacedBy(critical: Critical): boolean;
}
export default LoadingTimeIncreased;
