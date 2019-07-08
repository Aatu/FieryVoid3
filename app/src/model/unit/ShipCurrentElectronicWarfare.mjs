import * as ewTypes from "../electronicWarfare/electronicWarfareTypes.mjs";

class ShipCurrentElectronicWarfare {
  constructor(dew, ccew, entries) {
    this.dew = dew;
    this.ccew = ccew;
    this.entries = entries.map(entry => entry.clone());
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
