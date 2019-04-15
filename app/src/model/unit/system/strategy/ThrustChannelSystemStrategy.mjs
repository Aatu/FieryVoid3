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

  canChannelAmount(system, amount) {
    if (
      system.hasCritical(FirstThrustIgnored) ||
      system.hasCritical(EfficiencyHalved)
    ) {
      return amount <= this.output;
    } else {
      return amount <= this.output * 2;
    }
  }

  getChannelCost(system, amount) {
    let cost = 0;

    if (system.hasCritical(FirstThrustIgnored)) {
      cost += 1;
    }

    if (system.hasCritical(EfficiencyHalved)) {
      cost += amount * 2;
    } else {
      cost += amount;
    }

    return cost;
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
