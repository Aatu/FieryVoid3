import ShipSystemStrategy from "../ShipSystemStrategy.js";

class StandardRangeStrategy extends ShipSystemStrategy {
  constructor(rangesAndPenalties) {
    super();

    this.rangesAndPenalties = rangesAndPenalties || [];
  }

  getUiComponents(payload, previousResponse = []) {
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

  isOnRange({ distance }) {
    return distance <= this.getMaxRange();
  }

  getMaxRange() {
    return this.rangesAndPenalties[this.rangesAndPenalties.length - 1].range;
  }

  getRangeModifier({ distance: currentRange }) {
    const exactModifier = this.rangesAndPenalties.find(
      ({ range }) => range === currentRange
    );

    if (exactModifier) {
      return exactModifier.modifier;
    }

    let start = null;
    let end = null;

    this.rangesAndPenalties.forEach(({ range, modifier }) => {
      if ((start === null || range > start.range) && range < currentRange) {
        start = { range, modifier };
      } else if ((end === null || range < end.range) && range > currentRange) {
        end = { range, modifier };
      }
    });

    if (!end) {
      return -200;
    }

    const difference = end.modifier - start.modifier;
    const distance = end.range - start.range;
    return Math.round(
      start.modifier + (difference * (currentRange - start.range)) / distance
    );
  }
}

export default StandardRangeStrategy;
