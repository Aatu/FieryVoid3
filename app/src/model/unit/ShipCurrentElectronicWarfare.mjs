import * as ewTypes from "../electronicWarfare/electronicWarfareTypes.mjs";
import ElectornicWarfareEntry from "../electronicWarfare/ElectronicWarfareEntry.mjs";
import Ship from "./Ship.mjs";

class ShipCurrentElectronicWarfare {
  constructor(dew, ccew, entries) {
    this.dew = dew;
    this.ccew = ccew;
    this.entries = entries ? entries.map(entry => entry.clone()) : [];
  }

  serialize() {
    return {
      dew: this.dew,
      ccew: this.ccew,
      entries: this.entries.map(entry => entry.serialize())
    };
  }

  deserialize(data = {}) {
    this.dew = data.dew || 0;
    this.ccew = data.ccew || 0;
    this.entries = data.entries
      ? data.entries.map(entry =>
          new ElectornicWarfareEntry().deserialize(entry)
        )
      : [];

    return this;
  }

  getDefensiveEw() {
    return this.dew;
  }

  getCcEw() {
    return this.ccew;
  }

  getOffensiveEw(target) {
    return this.getFromEntries(ewTypes.EW_OFFENSIVE, target);
  }

  getAllOew() {
    const combined = [];

    this.entries
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

  getFromEntries(type, target) {
    if (target instanceof Ship) {
      target = target.id;
    }

    return this.entries
      .filter(entry => entry.type === type && entry.targetShipId === target)
      .reduce((total, entry) => total + entry.getAmount(), 0);
  }
}

export default ShipCurrentElectronicWarfare;
