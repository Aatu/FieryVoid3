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
    return this.getRemainingPowerOutput() >= 0 || this.getPowerRequired() === 0;
  }

  canSetOffline(system) {
    return system.power.canSetOffline();
  }

  canSetOnline(system) {
    if (!system.power.canSetOnline()) {
      return false;
    }

    return this.getRemainingPowerOutput() >= system.power.getPowerRequirement();
  }

  copyPower(ship) {
    this.shipSystems.getSystems().forEach(system => {
      const otherSystem = ship.systems.getSystemById(system.id);

      if (otherSystem.power.isGoingOffline()) {
        if (this.canSetOffline(system)) {
          system.power.setOffline();
        }
      }

      if (otherSystem.power.isGoingOnline()) {
        if (this.canSetOnline(system)) {
          system.power.setOnline();
        }
      }
    });
  }

  forceValidPower() {
    const shuffle = a => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const systems = shuffle(this.shipSystems.getSystems());

    systems.forEach(system => {
      if (this.canSetOffline(system) && !this.isValidPower()) {
        system.power.setOffline();
      }
    });
  }

  advanceTurn(turn) {}
}

export default ShipPower;
