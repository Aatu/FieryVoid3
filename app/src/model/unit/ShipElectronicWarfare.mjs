import * as ewTypes from "../electronicWarfare/electronicWarfareTypes.mjs";
import ElectronicWarfareEntry from "../electronicWarfare/ElectronicWarfareEntry.mjs";
import Ship from "../unit/Ship.mjs";
import ShipCurrentElectronicWarfare from "./ShipCurrentElectronicWarfare.mjs";

export class UnableToAssignEw extends Error {}

class ShipElectronicWarfare {
  constructor(ship) {
    this.ship = ship;
    this.inEffect = new ShipCurrentElectronicWarfare();
  }

  serialize() {
    return this.inEffect.serialize();
  }

  deserialize(data = {}) {
    this.inEffect.deserialize(data);

    return this;
  }

  activatePlannedElectronicWarfare() {
    this.inEffect = new ShipCurrentElectronicWarfare(
      this.getDefensiveEw(),
      this.getCcEw(),
      this.getAllEntries()
    );

    console.log("activated EW", this.inEffect.serialize());
  }

  assignCcEw(amount) {
    this.assingEw(ewTypes.EW_CC, this.ship.id, amount);
  }

  assignOffensiveEw(target, amount) {
    this.assingEw(ewTypes.EW_OFFENSIVE, target, amount);
  }

  canAssignOffensiveEw(target, amount) {
    return this.canAssignEw(ewTypes.EW_OFFENSIVE, target, amount);
  }

  getCcEw() {
    return this.getEw(ewTypes.EW_CC, this.ship.id);
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

  getAllOew() {
    const combined = [];

    this.getEwArrays()
      .reduce(
        (all, system) => [...all, ...system.callHandler("getEwEntries")],
        []
      )
      .filter(entry => entry.getType() === ewTypes.EW_OFFENSIVE)
      .forEach(entry => {
        const existing = combined.find(
          combinedEntry => combinedEntry.targetShipId === entry.targetShipId
        );

        if (existing) {
          existing.amount += entry.amount;
        } else {
          combined.push(entry.clone());
        }
      });

    return combined;
  }

  getAllEntries() {
    return this.getEwArrays().reduce(
      (all, system) => [...all, ...system.callHandler("getEwEntries")],
      []
    );
  }

  getEwArrays() {
    return this.ship.systems
      .getSystems()
      .filter(system => system.callHandler("isEwArray"));
  }

  repeatElectonicWarfare() {
    this.assignEntries(this.getAllEntries(), true);
  }

  removeAll() {
    this.getEwArrays().forEach(system => system.callHandler("resetEw"));
  }

  assignEntries(entries, allowIncomplete = false) {
    this.removeAll();
    const negativeEntries = entries.filter(entry => entry.getAmount() < 0);

    entries
      .filter(entry => entry.getAmount() > 0)
      .map(entry => {
        negativeEntries
          .filter(
            negativeEntry =>
              negativeEntry.type === entry.type &&
              negativeEntry.targetShipId === entry.targetShipId
          )
          .forEach(negativeEntry => {
            if (entry.getAmount() >= Math.abs(negativeEntry.getAmount())) {
              entry.amount += negativeEntry.getAmount();
              negativeEntry.amount = 0;
            } else if (
              Math.abs(negativeEntry.getAmount()) > entry.getAmount()
            ) {
              negativeEntry.amount += entry.getAmount();
              entry.amount = 0;
            }
          });

        return entry;
      })
      .filter(entry => entry.getAmount() !== 0)
      .forEach(entry => this.assignPositiveEW(entry, allowIncomplete));

    if (negativeEntries.some(entry => entry.getAmount() !== 0)) {
      throw new UnableToAssignEw("Invalid EW, negative entries left");
    }
  }

  assignPositiveEW(entry, allowIncomplete) {
    let amount = entry.getAmount();
    while (amount > 0) {
      const availableSystems = this.getAvailableSystemsForEntry(entry);
      if (availableSystems.length === 0) {
        if (allowIncomplete) {
          return;
        } else {
          throw new UnableToAssignEw("Invalid EW");
        }
      }

      availableSystems.shift().callHandler("assignEw", {
        type: entry.type,
        target: entry.targetShipId,
        amount: 1
      });
      amount--;
    }
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
