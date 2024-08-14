import ElectornicWarfareEntry from "../electronicWarfare/ElectronicWarfareEntry";
import Ship from "./Ship";
import { SerializedElectronicWarfareEntry } from "../electronicWarfare/ElectronicWarfareEntry";
import { EW_TYPE } from "../electronicWarfare/electronicWarfareTypes";

export type SearializedShipCurrentElectronicWarfare = {
  dew?: number;
  ccew?: number;
  entries?: SerializedElectronicWarfareEntry[];
};

class ShipCurrentElectronicWarfare {
  public dew: number;
  public ccew: number;
  public entries: ElectornicWarfareEntry[] = [];

  constructor(dew: number, ccew: number, entries: ElectornicWarfareEntry[]) {
    this.dew = dew;
    this.ccew = ccew;
    this.entries = entries ? entries.map((entry) => entry.clone()) : [];
  }

  serialize(): SearializedShipCurrentElectronicWarfare {
    return {
      dew: this.dew,
      ccew: this.ccew,
      entries: this.entries.map((entry) => entry.serialize()),
    };
  }

  deserialize(data: SearializedShipCurrentElectronicWarfare = {}) {
    this.dew = data.dew || 0;
    this.ccew = data.ccew || 0;
    this.entries = data.entries
      ? data.entries.map(
          (entry) =>
            new ElectornicWarfareEntry(
              entry.type,
              entry.targetShipId,
              entry.amount
            )
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

  getOffensiveEw(target: Ship | string) {
    return this.getFromEntries(EW_TYPE.OFFENSIVE, target);
  }

  getAllOew(): ElectornicWarfareEntry[] {
    const combined: ElectornicWarfareEntry[] = [];

    this.entries
      .filter((entry) => entry.getType() === EW_TYPE.OFFENSIVE)
      .forEach((entry) => {
        const existing = combined.find(
          (combinedEntry) => combinedEntry.targetShipId === entry.targetShipId
        );

        if (existing) {
          existing.amount += entry.amount;
        } else {
          combined.push(entry.clone());
        }
      });

    return combined;
  }

  getFromEntries(type: EW_TYPE, target: Ship | string) {
    if (target instanceof Ship) {
      target = target.getId();
    }

    return this.entries
      .filter((entry) => entry.type === type && entry.targetShipId === target)
      .reduce((total, entry) => total + entry.getAmount(), 0);
  }
}

export default ShipCurrentElectronicWarfare;
