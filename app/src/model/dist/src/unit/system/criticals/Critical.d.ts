import ShipSystem from "../ShipSystem";
export type SerializedCritical = {
    className: string;
    id: string;
    duration: number | null;
    turnsRemaining: number | null;
};
declare class Critical {
    id: string;
    duration: number | null;
    turnsRemaining: number | null;
    constructor(duration?: number | null);
    getMessage(): string;
    serialize(): SerializedCritical;
    deserialize(data: SerializedCritical): this;
    advanceTurn(): void;
    excludes(critical: Critical): boolean;
    isReplacedBy(critical: Critical): boolean;
    isFixed(system: ShipSystem): boolean;
    getDuration(): number | null;
    getClassName(): string;
}
export default Critical;
