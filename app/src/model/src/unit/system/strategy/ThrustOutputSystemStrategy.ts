import ShipSystemStrategy from "./ShipSystemStrategy";
import {
  OutputReduced2,
  OutputReduced4,
  OutputReduced6,
  OutputReduced8,
} from "../criticals/index";
import OutputReduced from "../criticals/OutputReduced";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";

class ThrustOutputSystemStrategy extends ShipSystemStrategy {
  private output: number;

  constructor(output: number) {
    super();

    this.output = output || 0;
  }

  getOutputForBoost(payload: unknown, previousResponse = 0) {
    if (previousResponse > this.output) {
      return previousResponse;
    }

    return this.output;
  }

  getThrustOutput(payload: unknown, previousResponse = 0) {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    let output = this.output;

    output -= this.getSystem()
      .damage.getCriticals()
      .filter((critical) => critical instanceof OutputReduced)
      .reduce((total, current) => total + current.getOutputReduction(), 0);

    if (output < 0) {
      output = 0;
    }

    return (
      previousResponse +
      this.getSystem().callHandler(SYSTEM_HANDLERS.getBoost, undefined, 0) +
      output
    );
  }

  getPossibleCriticals(payload: unknown, previousResponse = []) {
    return [
      ...previousResponse,
      { severity: 20, critical: new OutputReduced(2, 2) },
      {
        severity: 30,
        critical: new OutputReduced(Math.ceil(this.output / 4), 2),
      },
      {
        severity: 60,
        critical: new OutputReduced(Math.ceil(this.output / 3), 2),
      },
      {
        severity: 70,
        critical: new OutputReduced(Math.ceil(this.output / 2), 2),
      },
      { severity: 30, critical: new OutputReduced(2) },
      { severity: 70, critical: new OutputReduced(Math.ceil(this.output / 4)) },
      { severity: 80, critical: new OutputReduced(Math.ceil(this.output / 3)) },
      { severity: 90, critical: new OutputReduced(Math.ceil(this.output / 2)) },
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
