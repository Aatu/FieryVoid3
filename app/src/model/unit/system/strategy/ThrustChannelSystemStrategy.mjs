import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import ThrustChannelHeatIncreased from "../criticals/ThrustChannelHeatIncreased.mjs";
import { OutputReduced } from "../criticals/index.mjs";

const directionsToString = {
  0: "Thrust forward",
  3: "Thrust aft",
  1: "Thrust starboard",
  2: "Thrust starboard",
  4: "Thrust port",
  5: "Thrust port",
  6: "Pivot right",
  7: "Pivot left",
  8: "Roll, Evade"
};

class ThrustChannelSystemStrategy extends ShipSystemStrategy {
  constructor(output, direction) {
    super();

    this.output = output || 0;
    this.direction = direction || 0; // 0, 3, [4,5], [1,2], 6
    this.channeled = 0;
    this.heatPerThrustChanneled = 0.75;
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
      return this.direction
        .map(direction => directionsToString[direction])
        .join(", ");
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

    return previousResponse + this.getChannelOutput();
  }

  generatesHeat() {
    return true;
  }

  getHeatPerThrustChanneled() {
    let heat = this.heatPerThrustChanneled;

    heat *=
      1 +
      this.system.damage
        .getCriticals()
        .filter(critical => critical instanceof ThrustChannelHeatIncreased)
        .reduce((total, current) => total + current.getHeatIncrease(), 0);

    return heat;
  }

  getHeatForThrust({ amount }) {
    return amount * this.getHeatPerThrustChanneled();
  }

  getHeatGenerated(payload, previousResponse = 0) {
    return previousResponse + this.channeled * this.getHeatPerThrustChanneled();
  }

  getThrustDirection(payload, previousResponse = null) {
    return this.direction;
  }

  getChannelOutput() {
    let output = this.output;

    output -= this.system.damage
      .getCriticals()
      .filter(critical => critical instanceof OutputReduced)
      .reduce((total, current) => total + current.getOutputReduction(), 0);

    if (output < 0) {
      output = 0;
    }

    return output;
  }

  getMaxChannelAmount() {
    return this.getChannelOutput();
  }

  canChannelAmount(amount) {
    return amount <= this.getMaxChannelAmount();
  }

  getChannelCost(amount) {
    return amount;
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

      { severity: 20, critical: new ThrustChannelHeatIncreased(0.5, 1) },
      {
        severity: 30,
        critical: new OutputReduced(Math.ceil(this.output / 4), 2)
      },
      { severity: 40, critical: new ThrustChannelHeatIncreased(0.5, 3) },
      { severity: 60, critical: new ThrustChannelHeatIncreased(0.5) },
      { severity: 70, critical: new OutputReduced(Math.ceil(this.output / 4)) },
      { severity: 80, critical: new OutputReduced(Math.ceil(this.output / 3)) },
      { severity: 90, critical: new OutputReduced(Math.ceil(this.output / 2)) }
    ];
  }
}

export default ThrustChannelSystemStrategy;
