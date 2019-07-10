export default ThrustChannelSystemStrategy;

import ShipSystem from "../ShipSystem.mjs";

class Weapon extends ShipSystem {
  constructor(args, numberOfShots) {
    super(args);
    this.numberOfShots = numberOfShots;
  }
}

export default Weapon;
