import ShipSystem from "../ShipSystem.mjs";

class Structure extends ShipSystem {
  constructor(args, output) {
    super(args);
    this.strategies = [];
  }
}

export default Structure;
