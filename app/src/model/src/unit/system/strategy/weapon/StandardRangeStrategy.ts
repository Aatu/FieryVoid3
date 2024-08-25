import ShipSystemStrategy from "../ShipSystemStrategy";

export type RangePenaltyEntry = {
  range: number;
  modifier: number;
};

class StandardRangeStrategy extends ShipSystemStrategy {
  private rangesAndPenalties: RangePenaltyEntry[];

  constructor(rangesAndPenalties: RangePenaltyEntry[]) {
    super();

    this.rangesAndPenalties = rangesAndPenalties || [];
  }

  getRangesAndPenalties() {
    return this.rangesAndPenalties;
  }

  getUiComponents(
    payload: unknown,
    previousResponse = []
  ): {
    name: string;
    props: {
      rangeStrategy: StandardRangeStrategy;
    };
  }[] {
    return [
      ...previousResponse,
      {
        name: "RangePenalty",
        props: {
          rangeStrategy: this,
        },
      },
    ];
  }

  isOnRange({ distance }: { distance: number }) {
    return distance <= this.getMaxRange();
  }

  getMaxRange() {
    return this.rangesAndPenalties[this.rangesAndPenalties.length - 1].range;
  }

  getRangeModifier({ distance: currentRange }: { distance: number }): number {
    const exactModifier = this.rangesAndPenalties.find(
      ({ range }) => range === currentRange
    );

    if (exactModifier) {
      return exactModifier.modifier;
    }

    let start: RangePenaltyEntry | null = null;
    let end: RangePenaltyEntry | null = null;

    this.rangesAndPenalties.forEach(({ range, modifier }) => {
      if ((start === null || range > start.range) && range < currentRange) {
        start = { range, modifier };
      } else if ((end === null || range < end.range) && range > currentRange) {
        end = { range, modifier };
      }
    });

    if (!end || !start) {
      return -200;
    }

    const difference =
      (end as RangePenaltyEntry).modifier -
      (start as RangePenaltyEntry).modifier;
    const distance =
      (end as RangePenaltyEntry).range - (start as RangePenaltyEntry).range;
    return Math.round(
      (start as RangePenaltyEntry).modifier +
        (difference * (currentRange - (start as RangePenaltyEntry).range)) /
          distance
    );
  }
}

export default StandardRangeStrategy;
