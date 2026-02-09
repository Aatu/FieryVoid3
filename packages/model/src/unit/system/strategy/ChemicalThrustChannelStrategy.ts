import { ThrustChannelHeatIncreased } from "../criticals";
import ShipSystem from "../ShipSystem";
import {
  IThrustChannelStrategy,
  THRUSTER_DIRECTION,
} from "./ThrustChannelSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";

export type ChemicalThrusterArgs = {
  output: number;
  fuelPerThrust: number;
  heatPerThrust: number;
};

export class ChemicalThrustChannelStrategy implements IThrustChannelStrategy {
  private thrusterArgs: ChemicalThrusterArgs;

  constructor(args: ChemicalThrusterArgs) {
    this.thrusterArgs = args;
  }

  isBoostable() {
    return false;
  }

  canBoost() {
    return false;
  }

  getMessages(system: ShipSystem): SystemMessage[] {
    return [];
  }

  equals(other: IThrustChannelStrategy) {
    return this.getStrategyName() === other.getStrategyName();
  }

  getBackgroundImage(system: ShipSystem): string {
    if (system.handlers.isThrustDirection(THRUSTER_DIRECTION.AFT)) {
      return "/img/system/thrusterC2.png";
    } else if (
      system.handlers.isThrustDirection(THRUSTER_DIRECTION.STARBOARD_AFT)
    ) {
      return "/img/system/thrusterC4.png";
    } else if (system.handlers.isThrustDirection(THRUSTER_DIRECTION.PORT_AFT)) {
      return "/img/system/thrusterC3.png";
    }
    return "/img/system/thrusterC1.png";
  }

  advanceTurn(isActive: boolean): void {}

  getStrategyName() {
    return this.constructor.name;
  }

  deserialize(data: Record<string, unknown>) {}

  serialize() {
    return {};
  }

  getFuelRequirement(amount: number): number {
    const fuel = amount * this.thrusterArgs.fuelPerThrust * (1 + amount / 10);

    return Math.round(fuel);
  }

  generatesHeat() {
    return true;
  }

  private getHeatPerThrustChanneled(system: ShipSystem) {
    let heat = this.thrusterArgs.heatPerThrust;

    heat *=
      1 +
      system.damage
        .getCriticals()
        .filter((critical) => critical instanceof ThrustChannelHeatIncreased)
        .reduce((total, current) => total + current.getHeatIncrease(), 0);

    return heat;
  }

  getHeatGenerated(channeled: number, system: ShipSystem) {
    return channeled * this.getHeatPerThrustChanneled(system);
  }

  getThrustOutput(system: ShipSystem) {
    return this.thrusterArgs.output;
  }

  getMaxChannelAmount(system: ShipSystem) {
    return this.getThrustOutput(system);
  }

  canChannelAmount(amount: number, system: ShipSystem) {
    return amount <= this.getMaxChannelAmount(system);
  }

  getChannelCost(amount: number) {
    return amount;
  }
}
