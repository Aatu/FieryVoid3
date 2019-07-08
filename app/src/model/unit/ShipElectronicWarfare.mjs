import * as ewTypes from "../electronicWarfare/electronicWarfareTypes.mjs";
import ElectronicWarfareEntry from "../electronicWarfare/ElectronicWarfareEntry.mjs";
import Ship from "../unit/Ship.mjs";

class UnableToAssignEw extends Error {}

class ShipElectronicWarfare {
  constructor(ship) {
    this.ship = ship;
  }

  assignOffensiveEw(target, amount) {
    this.assingEw(ewTypes.EW_OFFENSIVE, target, amount);
  }

  getDefensiveEw() {
    return this.getEw(ewTypes.EW_DEFENSIVE);
  }

  getOffensiveEw(target) {
    return this.getEw(ewTypes.EW_OFFENSIVE, target);
  }

  getEw(type, target) {
    if (target && target instanceof Ship) {
      target = target.id;
    }

    if (type === ewTypes.EW_DEFENSIVE) {
      return this.getEwArrays().reduce(
        (total, system) =>
          total + system.callHandler("getTotalEwUsedByType", type),
        0
      );
    }

    return this.getAllEntries()
      .filter(entry => entry.type === type && entry.targetShipId === target)
      .reduce((total, entry) => total + entry.getAmount(), 0);
  }

  assingEw(type, target, amount) {
    if (target && target instanceof Ship) {
      target = target.id;
    }
    const entries = this.getAllEntries();
    entries.push(new ElectronicWarfareEntry(type, target, amount));
    this.assignEntries(entries);
  }

  canAssignEw(type, target, amount) {
    const entries = this.getAllEntries();
    try {
      this.assingEw(type, target, amount);
      this.assignEntries(entries);
      return true;
    } catch (e) {
      if (e instanceof UnableToAssignEw) {
        this.assignEntries(entries);
        return false;
      }

      throw e;
    }
  }

  getAllEntries() {
    return this.getEwArrays().reduce(
      (all, system) => [...all, ...system.callHandler("getEwEntries")],
      []
    );
  }

  deserialize(data = {}) {
    return this;
  }

  serialize() {
    return {};
  }

  getEwArrays() {
    return this.ship.systems
      .getSystems()
      .filter(system => system.callHandler("isEwArray"));
  }

  assignEntries(entries) {
    this.getEwArrays().forEach(system => system.callHandler("resetEw"));

    entries.forEach(entry => {
      let amount = entry.getAmount();
      while (amount > 0) {
        const availableSystems = this.getAvailableSystemsForEntry(entry);
        if (availableSystems.length === 0) {
          throw new UnableToAssignEw("Check ew validity first!");
        }

        availableSystems.shift().callHandler("assignEw", {
          type: entry.type,
          target: entry.targetShipId,
          amount: 1
        });
        amount--;
      }
    });
  }

  getAvailableSystemsForEntry(entry) {
    return this.getEwArrays()
      .filter(system =>
        system.callHandler("canUseEw", {
          type: entry.type,
          amount: 1
        })
      )
      .sort((a, b) => {
        const aValidTypes = a.callHandler("getValidEwTypes");
        const bValidTypes = b.callHandler("getValidEwTypes");

        if (aValidTypes.length > bValidTypes.length) {
          return -1;
        } else if (aValidTypes.length < bValidTypes.length) {
          return 1;
        }

        return 0;
      });
  }
}

export default ShipElectronicWarfare;
