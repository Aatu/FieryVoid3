import ShipSystem from "../ShipSystem.mjs";
import { PowerOutputSystemStrategy } from "../strategy";

class Reactor extends ShipSystem {
  constructor(args, output) {
    super(args, [new PowerOutputSystemStrategy(output)]);
  }
}

export default Reactor;
