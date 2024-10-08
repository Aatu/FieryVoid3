import GameData from "../../model/src/game/GameData";
import Ship from "../../model/src/unit/Ship";
import { ForcedOfflineOverheat } from "../../model/src/unit/system/criticals";
import ShipSystemLogEntryHeat from "../../model/src/unit/system/ShipSystemLog/ShipSystemLogEntryHeat";
import { SYSTEM_HANDLERS } from "../../model/src/unit/system/strategy/types/SystemHandlersTypes";

class HeatHandler {
  advance(gameData: GameData) {
    gameData.ships.getShips().forEach((ship) => {
      this.warmSystems(ship);
      this.collectHeat(ship);
      this.markNewOverheat(ship);
      this.overHeatSystems(ship);
      this.radiateHeat(ship);
    });
  }

  warmSystems(ship: Ship) {
    ship.systems
      .getSystems()
      .filter((system) => !system.isDestroyed())
      .forEach((system) => {
        const overheat = system.heat.getOverheat();
        const heatGenerated = system.heat.generateHeat();

        if (overheat || heatGenerated) {
          const logEntry =
            system.log.getOpenLogEntryByClass<ShipSystemLogEntryHeat>(
              ShipSystemLogEntryHeat
            );

          logEntry.setInitialOverheat(
            system.heat.getOverheat(),
            system.heat.getOverheatPercentage()
          );
          logEntry.setHeatGenerated(heatGenerated);
        }
      });
  }

  collectHeat(ship: Ship) {
    ship.systems
      .getSystems()
      .filter((system) => !system.isDestroyed())
      .filter((system) => system.heat.getHeatStoreCapacity() >= 1)
      .forEach((system) => {
        if (system.heat.getHeat()) {
          const logEntry =
            system.log.getOpenLogEntryByClass<ShipSystemLogEntryHeat>(
              ShipSystemLogEntryHeat
            );

          logEntry.setIntialHeatStored(system.heat.getHeat());
        }
      });

    while (true) {
      const storages = ship.systems
        .getSystems()
        .filter((system) => !system.isDestroyed())
        .filter((system) => system.heat.getHeatStoreCapacity() >= 1);

      const hotSystems = ship.systems
        .getSystems()
        .filter((system) => !system.isDestroyed())
        .filter((system) => system.heat.isHeatStorage() === false)
        .filter((system) => system.heat.getTransferHeat())
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

      hotSystems.forEach((system) => {
        let heat = system.heat.getTransferHeat();
        storages.forEach((storage) => {
          const step = heat < 1 ? heat : 1;

          if (heat === 0 || storage.heat.getHeatStoreCapacity() < step) {
            return;
          }

          heat -= step;
          storage.heat.changeHeat(step);
          system.heat.changeHeat(-step);

          storage.log
            .getOpenLogEntryByClass<ShipSystemLogEntryHeat>(
              ShipSystemLogEntryHeat
            )
            .addNewHeatStored(step);
        });
      });
    }
  }

  markNewOverheat(ship: Ship) {
    ship.systems
      .getSystems()
      .filter((system) => !system.isDestroyed())
      .forEach((system) => {
        system.heat.markNewOverheat();

        if (system.heat.getOverheat() || system.heat.getHeatTransferred()) {
          const logEntry =
            system.log.getOpenLogEntryByClass<ShipSystemLogEntryHeat>(
              ShipSystemLogEntryHeat
            );

          logEntry.setNewOverheat(
            system.heat.getOverheat(),
            system.heat.getOverheatPercentage()
          );
        }
      });
  }

  getOverheatRandomExtra() {
    return Math.random() * 0.5;
  }

  overHeatSystems(ship: Ship) {
    ship.systems
      .getSystems()
      .filter((system) => !system.isDestroyed())
      .forEach((system) => {
        let overHeat = system.heat.getOverheatPercentage();

        if (overHeat === 0) {
          return;
        }

        if (overHeat >= 2.0 && !system.hasCritical(ForcedOfflineOverheat)) {
          system.addCritical(new ForcedOfflineOverheat());
          const logEntry =
            system.log.getOpenLogEntryByClass<ShipSystemLogEntryHeat>(
              ShipSystemLogEntryHeat
            );

          logEntry.setForcedOffline();
        }
      });
  }

  radiateHeat(ship: Ship) {
    while (true) {
      const storages = ship.systems
        .getSystems()
        .filter((system) => !system.isDestroyed())
        .filter(
          (system) => system.heat.isHeatStorage() && system.heat.getHeat()
        );

      const radiators = ship.systems
        .getSystems()
        .filter((system) => !system.isDestroyed())
        .filter((system) => system.heat.getRadiateHeatCapacity() >= 1);

      if (storages.length === 0 || radiators.length === 0) {
        break;
      }

      storages.forEach((storage) => {
        let heat = storage.heat.getHeat();
        radiators.forEach((radiator) => {
          if (heat === 0 || radiator.heat.getRadiateHeatCapacity() < 1) {
            return;
          }

          heat--;
          storage.heat.changeHeat(-1);
          radiator.heat.radiateHeat(1);

          const logEntry =
            storage.log.getOpenLogEntryByClass<ShipSystemLogEntryHeat>(
              ShipSystemLogEntryHeat
            );

          logEntry.addHeatGivenToRadiators(1);
        });
      });
    }

    ship.systems
      .getSystems()
      .filter((system) => !system.isDestroyed())
      .forEach((system) => {
        const heatRadiated = system.callHandler(
          SYSTEM_HANDLERS.getRadiatedHeat,
          null,
          null
        );

        if (heatRadiated) {
          const logEntry =
            system.log.getOpenLogEntryByClass<ShipSystemLogEntryHeat>(
              ShipSystemLogEntryHeat
            );

          logEntry.setHeatRadiated(heatRadiated);
        }
      });
  }
}

export default HeatHandler;
