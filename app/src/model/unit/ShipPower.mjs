class ShipPower {
  constructor(shipSystems) {
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
      .filter(system => !system.power.isOffline())
      .reduce((acc, system) => acc + system.power.getPowerRequirement(), 0);
  }

  getRemainingPowerOutput() {
    return this.getPowerOutput() - this.getPowerRequired();
  }

  isValidPower() {
    return this.getRemainingPowerOutput() >= 0;
  }
}

export default ShipPower;
