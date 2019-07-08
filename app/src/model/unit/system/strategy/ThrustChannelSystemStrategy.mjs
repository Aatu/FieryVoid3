import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import { FirstThrustIgnored, EfficiencyHalved } from "../criticals";

const directionsToString = {
  0: "Thrust forward",
  3: "Thrust aft",
  1: "Thrust starboard",
  2: "Thrust starboard",
  4: "Thrust port",
  5: "Thrust port",
  6: "Pivot, roll and evade"
};

class ThrustChannelSystemStrategy extends ShipSystemStrategy {
  constructor(output, direction) {
    super();

    this.output = output || 0;
    this.direction = direction || 0; // 0, 3, [4,5], [1,2], 6
  }

  getDirectionString() {
    if (Array.isArray(this.direction)) {
      return directionsToString[this.direction[0]];
    }

    return directionsToString[this.direction];
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Output",
      value: this.output
    });

    previousResponse.push({
      header: "Manouver(s)",
      value: this.getDirectionString()
    });

    return previousResponse;
  }

  getThrustChannel(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.output;
  }

  getThrustDirection(payload, previousResponse = null) {
    if (previousResponse !== null) {
      throw new Error(
        "System implementing multiple getThrustDirection handlers is not supported"
      );
    }

    return this.direction;
  }

  getChannelOutput() {
    return this.output;
  }

  getMaxChannelAmount() {
    if (
      this.system.hasCritical(FirstThrustIgnored) ||
      this.system.hasCritical(EfficiencyHalved)
    ) {
      return this.output;
    } else {
      return this.output * 2;
    }
  }

  canChannelAmount(amount) {
    return amount <= this.getMaxChannelAmount();
  }

  getChannelCost(amount) {
    let cost = 0;

    if (this.system.hasCritical(FirstThrustIgnored)) {
      cost += 1;
    }

    if (this.system.hasCritical(EfficiencyHalved)) {
      cost += amount * 2;
    } else {
      cost += amount;
    }

    return cost;
  }

  isThruster(payload, previousResponse = 0) {
    return true;
  }

  isDirection(direction) {
    return (
      this.direction === direction ||
      (Array.isArray(this.direction) && this.direction.includes(direction))
    );
  }

  getPossibleCriticals(payload, previousResponse = []) {
    return [
      ...previousResponse,
      { weight: 10, className: FirstThrustIgnored },
      { weight: 5, className: EfficiencyHalved }
    ];
  }
}

export default ThrustChannelSystemStrategy;
