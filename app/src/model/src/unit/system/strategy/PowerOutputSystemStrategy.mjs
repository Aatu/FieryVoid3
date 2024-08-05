import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import {
  OutputReduced2,
  OutputReduced4,
  OutputReduced6,
  OutputReduced8
} from "../criticals/index.mjs";

class PowerOutputSystemStrategy extends ShipSystemStrategy {
  constructor(output) {
    super();

    this.output = output || 0;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Power output",
      value: this.getPowerOutput()
    });

    return previousResponse;
  }

  getPowerOutput(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    let output = this.output;

    if (this.system.hasCritical(OutputReduced2)) {
      output -= 2;
    }

    if (this.system.hasCritical(OutputReduced4)) {
      output -= 4;
    }

    if (this.system.hasCritical(OutputReduced6)) {
      output -= 6;
    }

    if (this.system.hasCritical(OutputReduced8)) {
      output -= 8;
    }

    if (output < 0) {
      output = 0;
    }

    return previousResponse + output;
  }

  getPossibleCriticals(payload, previousResponse = []) {
    return [
      ...previousResponse,
      { weight: 10, className: OutputReduced2 },
      { weight: 7, className: OutputReduced4 },
      { weight: 3, className: OutputReduced6 },
      { weight: 1, className: OutputReduced8 }
    ];
  }
}

export default PowerOutputSystemStrategy;
