import ShipSystemLogEntryCriticalHit from "../../model/unit/system/ShipSystemLog/ShipSystemLogEntryCriticalHit.mjs";

class CriticalHandler {
  advance(gameData) {
    gameData.ships.getShips().forEach(ship => {
      ship.systems
        .getSystems()
        .filter(system => !system.isDestroyed())
        .forEach(system => this.checkCriticalForSystem(system));
    });
  }

  checkCriticalForSystem(system) {
    const newDamage = system.damage.getNewDamage();
    const overheat = system.heat.getOverheatPercentage();
    const hitpoints = system.hitpoints;

    if (newDamage === 0 && overheat === 0) {
      return;
    }

    const logEntry = system.log.getOpenLogEntryByClass(
      ShipSystemLogEntryCriticalHit
    );

    const damage = system.damage.getTotalDamage() - newDamage;

    const ceil = this.getCeil(damage, newDamage, overheat, hitpoints, logEntry);
    const floor = this.getFloor(ceil);

    const possibleCriticals = system
      .callHandler("getPossibleCriticals", null, [])
      .filter(({ critical }) =>
        system.damage
          .getCriticals()
          .every(otherCritical => !otherCritical.excludes(critical))
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
      const possible = possibleCriticals.pop();
      if (possible.severity <= floor) {
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

  getCeil(damage, newDamage, overheat, hitpoints, logEntry) {
    const oldDamagePercent = Math.round(((damage * 0.5) / hitpoints) * 50);
    const newDamagePercent = Math.round(((newDamage * 1.5) / hitpoints) * 50);
    let heatPercent = Math.round((overheat - 1) * 25);
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

  getFloor(ceil) {
    const floor = Math.round(ceil * 0.8);
    if (floor > 100) {
      return 100;
    }

    return floor;
  }

  getRandomBonus() {
    return Math.round(Math.random() * 50);
  }

  randomizeCritical(criticals) {
    return criticals[Math.floor(Math.random() * criticals.length)].critical;
  }
}

export default CriticalHandler;
