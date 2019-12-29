import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import {
  OutputReduced2,
  OutputReduced4,
  OutputReduced6,
  OutputReduced8
} from "../criticals/index.mjs";

class ThrustOutputSystemStrategy extends ShipSystemStrategy {
  constructor(output) {
    super();

    this.output = output || 0;
  }

  getOutputForBoost(payload, previousResponse = 0) {
    if (previousResponse > this.output) {
      return previousResponse;
    }

    return this.output;
  }

  getThrustOutput(payload, previousResponse = 0) {
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

    return previousResponse + this.system.callHandler("getBoost") + output;
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

  onSystemOffline() {
    this.onSystemPowerLevelDecrease();
  }

  onSystemPowerLevelDecrease() {
    if (
      !this.system ||
      !this.system.shipSystems ||
      !this.system.shipSystems.ship
    ) {
      return;
    }

    this.system.shipSystems.ship.movement.revertMovementsUntilValidMovement();
  }
}

export default ThrustOutputSystemStrategy;
