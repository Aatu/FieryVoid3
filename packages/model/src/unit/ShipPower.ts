import { shuffleArray } from "../utils/math";
import Ship from "./Ship";
import ShipSystems from "./ShipSystems";
import ShipSystem from "./system/ShipSystem";

class ShipPower {
  private shipSystems: ShipSystems;

  constructor(shipSystems: ShipSystems) {
    this.shipSystems = shipSystems;
  }

  getPowerOutput() {
    return this.shipSystems
      .getSystems()
      .reduce((acc, system) => acc + system.power.getPowerOutput(), 0);
  }

  getPowerRequired() {
    return this.shipSystems
      .getSystems()
      .filter((system) => !system.power.isOffline())
      .reduce((acc, system) => acc + system.power.getPowerRequirement(), 0);
  }

  getRemainingPowerOutput() {
    return this.getPowerOutput() - this.getPowerRequired();
  }

  isValidPower() {
    return this.getRemainingPowerOutput() >= 0 || this.getPowerRequired() === 0;
  }

  canSetOffline(system: ShipSystem) {
    return system.power.canSetOffline();
  }

  canSetOnline(system: ShipSystem) {
    if (!system.power.canSetOnline()) {
      return false;
    }

    return this.getRemainingPowerOutput() >= system.power.getPowerRequirement();
  }

  copyPower(ship: Ship) {
    this.shipSystems.getSystems().forEach((system) => {
      const otherSystem = ship.systems.getSystemById(system.id);

      if (otherSystem.power.isGoingOffline() && system.power.isOnline()) {
        system.power.setOffline();
      }

      if (otherSystem.power.isGoingOnline() && system.power.isOffline()) {
        system.power.setOnline();
      }
    });
  }

  forceValidPower() {
    const systems = shuffleArray(this.shipSystems.getSystems());

    systems.forEach((system) => {
      if (this.canSetOffline(system) && !this.isValidPower()) {
        system.power.setOffline();
      }
    });
  }

  advanceTurn(turn: number) {}
}

export default ShipPower;
