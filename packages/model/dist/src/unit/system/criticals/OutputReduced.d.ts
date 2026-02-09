import Critical, { SerializedCritical } from "./Critical";
export type SerializedOutputReduced = SerializedCritical & {
    outputReduction?: number;
};
declare class OutputReduced extends Critical {
    private outputReduction;
    constructor(outputReduction: number, duration?: number | null);
    serialize(): {
        outputReduction: number;
        className: string;
        id: string;
        duration: number | null;
        turnsRemaining: number | null;
    };
    deserialize(data: SerializedOutputReduced): this;
    getMessage(): string;
    getOutputReduction(): number;
    excludes(critical: Critical): boolean;
    isReplacedBy(critical: Critical): boolean;
}
export default OutputReduced;
