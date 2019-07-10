import StandardRangeStrategy from "./ShipSystemStrategy.mjs";

class StandardRangeStrategy extends ShipSystemStrategy {
  constructor() {
    super();

    /*
    TODO: Range penalties should go in steps so that 
    
    fast tracking small turrets have low range penalty close up and due to slow bullet, high when the range increases

    Spinal mounted heavy weapons have high range penalty close up (the fast bullet can catch the target,
    but the weapon can not track the fast moving ship up close) This should also depend on shootin ship mass
    and agility, but I think it would be better to handle on weapon level. In other words, not putting fast tracking
    spinal weapons on large ships. 
    */
  }
}

export default StandardRangeStrategy;
