import ForcedOfflineOverheat from "../../model/unit/system/criticals/ForcedOfflineOverheat.mjs";

class HeatHandler {
  advance(gameData) {
    gameData.ships.getShips().forEach(ship => {
      this.warmSystems(ship);
      this.collectHeat(ship);
      this.overHeatSystems(ship);
      this.radiateHeat(ship);
    });
  }

  warmSystems(ship) {
    ship.systems.getSystems().forEach(system => system.heat.generateHeat());
  }

  collectHeat(ship) {
    while (true) {
      const storages = ship.systems
        .getSystems()
        .filter(system => !system.isDestroyed())
        .filter(system => system.heat.getHeatStoreCapacity() >= 1);

      const hotSystems = ship.systems
        .getSystems()
        .filter(system => !system.isDestroyed())
        .filter(system => system.heat.isHeatStorage() === false)
        .filter(system => system.heat.getTransferHeat())
        .sort((a, b) => {
          if (a.heat.getHeatPerStructure() > b.heat.getHeatPerStructure()) {
            return 1;
          }

          if (a.heat.getHeatPerStructure() < b.heat.getHeatPerStructure()) {
            return -1;
          }

          return 0;
        });

      if (storages.length === 0 || hotSystems.length === 0) {
        break;
      }

      hotSystems.forEach(system => {
        let heat = system.heat.getTransferHeat();
        storages.forEach(storage => {
          if (heat === 0 || storage.heat.getHeatStoreCapacity() < 1) {
            return;
          }

          heat--;
          storage.heat.changeHeat(1);
          system.heat.changeHeat(-1);
        });
      });
    }
  }

  getOverheatRandomExtra() {
    return Math.random() * 0.2;
  }

  overHeatSystems(ship) {
    ship.systems
      .getSystems()
      .filter(system => !system.isDestroyed())
      .forEach(system => {
        let overHeat = system.heat.getOverHeat();

        if (overHeat === 0) {
          return;
        }

        overHeat += this.getOverheatRandomExtra();

        if (overHeat >= 1 && !system.hasCritical(ForcedOfflineOverheat)) {
          system.addCritical(new ForcedOfflineOverheat());
        }
      });
  }

  radiateHeat(ship) {
    while (true) {
      const storages = ship.systems
        .getSystems()
        .filter(system => !system.isDestroyed())
        .filter(system => system.heat.isHeatStorage() && system.heat.getHeat());

      const radiators = ship.systems
        .getSystems()
        .filter(system => !system.isDestroyed())
        .filter(system => system.heat.getRadiateHeatCapacity() >= 1);

      if (storages.length === 0 || radiators.length === 0) {
        break;
      }

      storages.forEach(storage => {
        let heat = storage.heat.getHeat();
        radiators.forEach(radiator => {
          if (heat === 0 || radiator.heat.getRadiateHeatCapacity() < 1) {
            return;
          }

          heat--;
          storage.heat.changeHeat(-1);
          radiator.heat.radiateHeat(1);
        });
      });
    }
  }
}

export default HeatHandler;
