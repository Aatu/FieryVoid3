import ShipSystemStrategy from "../ShipSystemStrategy.mjs";

class StandardRangeStrategy extends ShipSystemStrategy {
  constructor(rangesAndPenalties) {
    super();

    this.rangesAndPenalties = rangesAndPenalties;

    /*
    TODO: Range penalties should go in steps so that 
    
    fast tracking small turrets have low range penalty close up and due to slow bullet, high when the range increases

    Spinal mounted heavy weapons have high range penalty close up (the fast bullet can catch the target,
    but the weapon can not track the fast moving ship up close) This should also depend on shootin ship mass
    and agility, but I think it would be better to handle on weapon level. In other words, not putting fast tracking
    spinal weapons on large ships. 
    */
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
      return false;
    }

    const difference = end.modifier - start.modifier;
    const distance = end.range - start.range;
    return (
      start.modifier + (difference * (currentRange - start.range)) / distance
    );
  }
}

export default StandardRangeStrategy;
