import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import {
  OutputReduced2,
  OutputReduced4,
  OutputReduced6,
  OutputReduced8
} from "../criticals/index.mjs";
import * as ewTypes from "../../../electronicWarfare/electronicWarfareTypes.mjs";
import ElectronicWarfareEntry from "../../../electronicWarfare/ElectronicWarfareEntry.mjs";
import Ship from "../../Ship.mjs";
import OutputReduced from "../criticals/OutputReduced.mjs";

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
    this.entries = data.electronicWarfareProvider
      ? data.electronicWarfareProvider.map(
          entry =>
            new ElectronicWarfareEntry(
              entry.type,
              entry.targetShipId,
              entry.amount
            )
        )
      : [];

    return this;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Usage/Output",
      value: this.getUsageVsOutputText()
    });

    previousResponse.push({
      header: "EW type(s)",
      value: this.allowedEwTypes.map(typeAsString).join(", ")
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
      if (!this.canUseEwType(ewTypes.EW_DEFENSIVE)) {
        return 0;
      }

      return this.getUnusedCapacity();
    }

    return this.entries
      .filter(entry => entry.type === type)
      .reduce((total, entry) => total + entry.getAmount(), 0);
  }

  getTotalEwUsed() {
    return this.entries.reduce((total, entry) => total + entry.getAmount(), 0);
  }

  getOutputForBoost(payload, previousResponse = 0) {
    if (previousResponse > this.output) {
      return previousResponse;
    }

    return this.output;
  }

  getEwOutput(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    let output = this.output;

    output -= this.system.damage
      .getCriticals()
      .filter(critical => critical instanceof OutputReduced)
      .reduce((total, current) => total + current.getOutputReduction(), 0);

    return (
      previousResponse + this.system.callHandler("getBoost", null, 0) + output
    );
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
      { severity: 20, critical: new OutputReduced(1) },
      {
        severity: 40,
        critical: new OutputReduced(Math.ceil(this.output / 4), 2)
      },
      {
        severity: 50,
        critical: new OutputReduced(Math.ceil(this.output / 3), 2)
      },

      {
        severity: 60,
        critical: new OutputReduced(Math.ceil(this.output / 2), 2)
      },
      { severity: 80, critical: new OutputReduced(Math.ceil(this.output / 4)) },
      { severity: 90, critical: new OutputReduced(Math.ceil(this.output / 3)) },
      { severity: 100, critical: new OutputReduced(Math.ceil(this.output / 2)) }
    ];
  }

  censorForUser({ mine }) {
    if (!mine) {
      this.entries = [];
    }
  }

  onSystemOffline() {
    this.onSystemPowerLevelDecrease();
  }

  onSystemPowerLevelDecrease() {
    if (
      !this.system ||
      !this.system.shipSystems ||
      !this.system.shipSystems.ship
    ) {
      return;
    }

    this.system.shipSystems.ship.electronicWarfare.repeatElectonicWarfare();
  }
}

export default ElectronicWarfareProvider;
