import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import { FirstThrustIgnored, EfficiencyHalved } from "../criticals";

class ThrustChannelSystemStrategy extends ShipSystemStrategy {
  constructor(output, direction) {
    super();

    this.output = output || 0;
    this.direction = direction || 0; // 0, 3, [4,5], [1,2], 6
  }

  getThrustChannel(system, payload, previousResponse = 0) {
    if (system.isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.output;
  }

  getThrustDirection(system, payload, previousResponse = null) {
    if (previousResponse !== null) {
      throw new Error(
        "System implementing multiple getThrustDirection handlers is not supported"
      );
    }

    return this.direction;
  }

  isThruster(system, payload, previousResponse = 0) {
    return true;
  }

  getPossibleCriticals(system, payload, previousResponse = []) {
    return [
      ...previousResponse,
      { weight: 10, className: FirstThrustIgnored },
      { weight: 5, className: EfficiencyHalved }
    ];
  }
}

export default ThrustChannelSystemStrategy;
