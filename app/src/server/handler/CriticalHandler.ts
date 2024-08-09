import GameData from "../../model/src/game/GameData";
import { CriticalTableEntry } from "../../model/src/unit/system/criticals";
import ShipSystem from "../../model/src/unit/system/ShipSystem";
import ShipSystemLogEntryCriticalHit from "../../model/src/unit/system/ShipSystemLog/ShipSystemLogEntryCriticalHit";
import { SYSTEM_HANDLERS } from "../../model/src/unit/system/strategy/types/SystemHandlersTypes";

class CriticalHandler {
  advance(gameData: GameData) {
    gameData.ships.getShips().forEach((ship) => {
      ship.systems
        .getSystems()
        .filter((system) => !system.isDestroyed())
        .forEach((system) => this.checkCriticalForSystem(system));
    });
  }

  checkCriticalForSystem(system: ShipSystem) {
    const newDamage = system.damage.getNewDamage();
    const overheat = system.heat.getOverheatPercentage();
    const hitpoints = system.hitpoints;

    if (newDamage === 0 && overheat <= 1) {
      return;
    }

    const logEntry =
      system.log.getOpenLogEntryByClass<ShipSystemLogEntryCriticalHit>(
        ShipSystemLogEntryCriticalHit
      );

    const damage = system.damage.getTotalDamage() - newDamage;

    const ceil = this.getCeil(damage, newDamage, overheat, hitpoints, logEntry);
    const floor = this.getFloor(ceil);

    const possibleCriticals = system
      .callHandler(
        SYSTEM_HANDLERS.getPossibleCriticals,
        null,
        [] as CriticalTableEntry[]
      )
      .filter(({ critical }) =>
        system.damage
          .getCriticals()
          .every((otherCritical) => !otherCritical.excludes(critical))
      )
      .sort((a, b) => {
        if (a.severity > b.severity) {
          return 1;
        }

        if (a.severity < b.severity) {
          return -1;
        }

        return 0;
      });

    if (possibleCriticals.length === 0) {
      return;
    }

    const attainableCriticals = possibleCriticals.filter(
      ({ severity }) => severity > floor && severity <= ceil
    );

    let newCritical = null;

    if (attainableCriticals.length === 0) {
      const possible = possibleCriticals
        .reverse()
        .find((critical) => critical.severity <= floor);

      if (possible) {
        newCritical = possible.critical;
      } else {
        return;
      }
    } else {
      newCritical = this.randomizeCritical(attainableCriticals);
    }

    system.damage.filterReplaced(newCritical);
    system.addCritical(newCritical);
    logEntry.setCriticalMessage(newCritical.getMessage());
  }

  getCeil(
    damage: number,
    newDamage: number,
    overheat: number,
    hitpoints: number,
    logEntry: ShipSystemLogEntryCriticalHit
  ) {
    const oldDamagePercent = Math.round(((damage * 0.5) / hitpoints) * 50);
    const newDamagePercent = Math.round(((newDamage * 1.5) / hitpoints) * 50);
    let heatPercent = Math.round((overheat - 1) * 50);
    const randomPercent = Math.round(this.getRandomBonus());

    if (heatPercent < 0) {
      heatPercent = 0;
    }

    logEntry.setOldDamagePoints(oldDamagePercent);
    logEntry.setNewDamagePoints(newDamagePercent);
    logEntry.setOverHeatPoints(heatPercent);
    logEntry.setExtraPoints(randomPercent);

    const ceil =
      oldDamagePercent + newDamagePercent + heatPercent + randomPercent;
    this.getRandomBonus();

    if (ceil > 100) {
      return 100;
    }

    return ceil;
  }

  getFloor(ceil: number) {
    const floor = Math.round(ceil * 0.8);
    if (floor > 100) {
      return 100;
    }

    return floor;
  }

  getRandomBonus() {
    return Math.round(Math.random() * 50);
  }

  randomizeCritical(criticals: CriticalTableEntry[]) {
    return criticals[Math.floor(Math.random() * criticals.length)].critical;
  }
}

export default CriticalHandler;
