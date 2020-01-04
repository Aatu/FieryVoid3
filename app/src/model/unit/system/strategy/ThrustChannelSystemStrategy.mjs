import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import { FirstThrustIgnored, EfficiencyHalved } from "../criticals/index.mjs";

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
    this.channeled = 0;
  }

  resetChanneledThrust() {
    this.channeled = 0;
  }

  addChanneledThrust(channel) {
    this.channeled += channel;
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      thrustChannelSystemStrategy: {
        channeled: this.channeled
      }
    };
  }

  getIconText() {
    return this.channeled + "/" + this.output;
  }

  deserialize(data = {}) {
    const thisData = data.thrustChannelSystemStrategy || {};
    this.channeled = thisData.channeled || 0;

    return this;
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

    previousResponse.push({
      header: "Channeled",
      value: this.channeled
    });

    previousResponse.push({
      header: "Heat generated",
      value: this.getHeatGenerated()
    });

    return previousResponse;
  }

  getThrustChannel(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    return previousResponse + this.output;
  }

  generatesHeat() {
    return true;
  }

  getHeatGenerated(payload, previousResponse = 0) {
    return previousResponse + this.channeled * 2;
  }

  getThrustDirection(payload, previousResponse = null) {
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

  advanceTurn() {
    this.channeled = 0;
  }

  getPossibleCriticals(payload, previousResponse = []) {
    return [
      ...previousResponse,
      {
        severity: 20,
        critical: new FirstThrustIgnored(Math.round(Math.random() * 2))
      },
      {
        severity: 30,
        critical: new EfficiencyHalved(Math.round(Math.random() * 2))
      },
      { severity: 50, critical: new FirstThrustIgnored() },
      { severity: 80, critical: new EfficiencyHalved() }
    ];
  }
}

export default ThrustChannelSystemStrategy;
