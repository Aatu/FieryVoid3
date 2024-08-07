import ShipSystemStrategy from "./ShipSystemStrategy";
import {
  OutputReduced2,
  OutputReduced4,
  OutputReduced6,
  OutputReduced8,
} from "../criticals/index";
import { SystemMessage } from "./types/SystemHandlersTypes";

class PowerOutputSystemStrategy extends ShipSystemStrategy {
  private output: number;

  constructor(output: number) {
    super();

    this.output = output || 0;
  }

  getMessages(payload: unknown, previousResponse: SystemMessage[] = []) {
    previousResponse.push({
      header: "Power output",
      value: this.getPowerOutput(undefined, 0),
    });

    return previousResponse;
  }

  getPowerOutput(payload: unknown, previousResponse = 0) {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    let output = this.output;

    if (this.getSystem().hasCritical(OutputReduced2)) {
      output -= 2;
    }

    if (this.getSystem().hasCritical(OutputReduced4)) {
      output -= 4;
    }

    if (this.getSystem().hasCritical(OutputReduced6)) {
      output -= 6;
    }

    if (this.getSystem().hasCritical(OutputReduced8)) {
      output -= 8;
    }

    if (output < 0) {
      output = 0;
    }

    return previousResponse + output;
  }

  getPossibleCriticals(payload: unknown, previousResponse = []) {
    return [
      ...previousResponse,
      { weight: 10, className: OutputReduced2 },
      { weight: 7, className: OutputReduced4 },
      { weight: 3, className: OutputReduced6 },
      { weight: 1, className: OutputReduced8 },
    ];
  }
}

export default PowerOutputSystemStrategy;
