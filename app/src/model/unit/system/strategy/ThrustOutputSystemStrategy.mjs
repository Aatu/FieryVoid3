import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import {
  OutputReduced2,
  OutputReduced4,
  OutputReduced6,
  OutputReduced8
} from "../criticals/index.mjs";
import OutputReduced from "../criticals/OutputReduced.mjs";

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

    output -= this.system.damage
      .getCriticals()
      .filter(critical => critical instanceof OutputReduced)
      .reduce((total, current) => total + current.getOutputReduction(), 0);

    if (output < 0) {
      output = 0;
    }

    return previousResponse + this.system.callHandler("getBoost") + output;
  }

  getPossibleCriticals(payload, previousResponse = []) {
    return [
      ...previousResponse,
      { severity: 20, critical: new OutputReduced(2, 2) },
      {
        severity: 30,
        critical: new OutputReduced(Math.ceil(this.output / 4), 2)
      },
      {
        severity: 60,
        critical: new OutputReduced(Math.ceil(this.output / 3), 2)
      },
      {
        severity: 70,
        critical: new OutputReduced(Math.ceil(this.output / 2), 2)
      },
      { severity: 30, critical: new OutputReduced(2) },
      { severity: 70, critical: new OutputReduced(Math.ceil(this.output / 4)) },
      { severity: 80, critical: new OutputReduced(Math.ceil(this.output / 3)) },
      { severity: 90, critical: new OutputReduced(Math.ceil(this.output / 2)) }
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
