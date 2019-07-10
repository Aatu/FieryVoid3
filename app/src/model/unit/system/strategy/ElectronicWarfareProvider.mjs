import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import {
  OutputReduced2,
  OutputReduced4,
  OutputReduced6,
  OutputReduced8
} from "../criticals";
import * as ewTypes from "../../../electronicWarfare/electronicWarfareTypes.mjs";
import ElectronicWarfareEntry from "../../../electronicWarfare/ElectronicWarfareEntry.mjs";
import Ship from "../../Ship.mjs";

const typeAsString = type => {
  switch (type) {
    case ewTypes.EW_OFFENSIVE:
      return "Offensive EW";
    case ewTypes.EW_DEFENSIVE:
      return "Defensive EW";
    case ewTypes.EW_CC:
      return "Close combat EW";
    case ewTypes.EW_OFFENSIVE_SUPPORT:
      return "Offensive support EW";
    case ewTypes.EW_DEFENSIVE_SUPPORT:
      return "Defensive EW";
    case ewTypes.EW_DISRUPTION:
      return "Disruption EW";
    case ewTypes.EW_AREA_DEFENSIVE_SUPPORT:
      return "Area defensive EW";
  }
};

class ElectronicWarfareProvider extends ShipSystemStrategy {
  constructor(output, allowedEwTypes) {
    super();

    this.output = output || 0;
    this.allowedEwTypes = allowedEwTypes || [
      ewTypes.EW_OFFENSIVE,
      ewTypes.EW_DEFENSIVE,
      ewTypes.EW_CC
    ];

    this.entries = [];
  }

  serialize(payload, previousResponse = []) {
    return {
      ...previousResponse,
      electronicWarfareProvider: [
        ...this.entries.map(entry => entry.serialize())
      ]
    };
  }

  deserialize(data = {}) {
    return (this.entries = data.electronicWarfareProvider
      ? data.electronicWarfareProvider.map(
          entry =>
            new ElectronicWarfareEntry(
              entry.type,
              entry.targetShipId,
              entry.amount
            )
        )
      : []);
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Usage/Output",
      value: this.getUsageVsOutputText()
    });

    previousResponse.push({
      header: "EW type(s)",
      value: this.allowedEwTypes.map(typeAsString)
    });

    return previousResponse;
  }

  getUsageVsOutputText() {
    return this.getTotalEwUsed() + "/" + this.getEwOutput();
  }

  getValidEwTypes() {
    return this.getValidEwTypes;
  }

  getEwEntry(type, targetId) {
    return this.entries.find(
      entry => entry.type === type && entry.targetShipId === targetId
    );
  }

  assignEw({ type, target, amount }) {
    if (target instanceof Ship) {
      target = target.id;
    }

    if (!this.canUseEw({ type, amount })) {
      throw new Error("Check validity first!");
    }

    let entry = this.getEwEntry(type, target);
    if (!entry && amount <= 0) {
      return;
    } else if (!entry) {
      entry = new ElectronicWarfareEntry(type, target, amount);
      this.entries.push(entry);
    } else {
      entry.addAmount(amount);
    }
  }

  getEwEntries() {
    return this.entries.map(entry => entry.clone());
  }

  canUseEw({ type, amount }) {
    return this.canUseEwType(type) && this.canUseEwAmount(amount);
  }

  canUseEwType(type) {
    return this.allowedEwTypes.includes(type);
  }

  canUseEwAmount(amount) {
    return this.getEwOutput() >= this.getTotalEwUsed() + amount;
  }

  getUnusedCapacity() {
    return this.getEwOutput() - this.getTotalEwUsed();
  }

  getTotalEwUsedByType(type) {
    if (type === ewTypes.EW_DEFENSIVE) {
      return this.getUnusedCapacity();
    }

    return this.entries
      .filter(entry => entry.type === type)
      .reduce((total, entry) => total + entry.getAmount(), 0);
  }

  getTotalEwUsed() {
    return this.entries.reduce((total, entry) => total + entry.getAmount(), 0);
  }

  getEwOutput(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    let output = this.output;

    if (this.system.hasCritical(OutputReduced2)) {
      output -= 2;
    }

    if (this.system.hasCritical(OutputReduced4)) {
      output -= 4;
    }

    if (this.system.hasCritical(OutputReduced6)) {
      output -= 6;
    }

    if (this.system.hasCritical(OutputReduced8)) {
      output -= 8;
    }

    if (output < 0) {
      output = 0;
    }

    return previousResponse + output;
  }

  isEwArray(payload, previousResponse = 0) {
    return true;
  }

  resetEw() {
    this.entries = [];
  }

  getPossibleCriticals(payload, previousResponse = []) {
    return [
      ...previousResponse,
      { weight: 10, className: OutputReduced2 },
      { weight: 7, className: OutputReduced4 },
      { weight: 3, className: OutputReduced6 },
      { weight: 1, className: OutputReduced8 }
    ];
  }
}

export default ElectronicWarfareProvider;
