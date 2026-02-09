import ShipSystemStrategy from "../ShipSystemStrategy";
export type RangePenaltyEntry = {
    range: number;
    modifier: number;
};
declare class StandardRangeStrategy extends ShipSystemStrategy {
    private rangesAndPenalties;
    constructor(rangesAndPenalties: RangePenaltyEntry[]);
    getRangesAndPenalties(): RangePenaltyEntry[];
    getUiComponents(payload: unknown, previousResponse?: never[]): {
        name: string;
        props: {
            rangeStrategy: StandardRangeStrategy;
        };
    }[];
    isOnRange({ distance }: {
        distance: number;
    }): boolean;
    getMaxRange(): number;
    getRangeModifier({ distance: currentRange }: {
        distance: number;
    }): number;
}
export default StandardRangeStrategy;
