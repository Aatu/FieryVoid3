import ShipSystemStrategy from "./ShipSystemStrategy";
import ElectronicWarfareEntry from "../../../electronicWarfare/ElectronicWarfareEntry";
import Ship from "../../Ship";
import OutputReduced from "../criticals/OutputReduced";
import { EW_TYPE } from "../../../electronicWarfare/electronicWarfareTypes";
import { SerializedElectronicWarfareEntry } from "../../../electronicWarfare/ElectronicWarfareEntry";
import { SYSTEM_HANDLERS, SystemMessage } from "./types/SystemHandlersTypes";
import { CriticalTableEntry } from "../criticals";

const typeAsString = (type: EW_TYPE) => {
  switch (type) {
    case EW_TYPE.OFFENSIVE:
      return "Offensive EW";
    case EW_TYPE.DEFENSIVE:
      return "Defensive EW";
    case EW_TYPE.CC:
      return "Close combat EW";
    case EW_TYPE.OFFENSIVE_SUPPORT:
      return "Offensive support EW";
    case EW_TYPE.DEFENSIVE_SUPPORT:
      return "Defensive EW";
    case EW_TYPE.DISRUPTION:
      return "Disruption EW";
    case EW_TYPE.AREA_DEFENSIVE_SUPPORT:
      return "Area defensive EW";
  }
};

export type SerializedElectronicWarfareProvider = {
  electronicWarfareProvider?: SerializedElectronicWarfareEntry[];
};

class ElectronicWarfareProvider extends ShipSystemStrategy {
  private output: number;
  private allowedEwTypes: EW_TYPE[];
  private entries: ElectronicWarfareEntry[];

  constructor(output: number, allowedEwTypes: EW_TYPE[]) {
    super();

    this.output = output || 0;
    this.allowedEwTypes = allowedEwTypes || [
      EW_TYPE.OFFENSIVE,
      EW_TYPE.DEFENSIVE,
      EW_TYPE.CC,
    ];

    this.entries = [];
  }

  serialize(payload: unknown, previousResponse = {}) {
    return {
      ...previousResponse,
      electronicWarfareProvider: [
        ...this.entries.map((entry) => entry.serialize()),
      ],
    };
  }

  deserialize(data: SerializedElectronicWarfareProvider = {}) {
    this.entries = data.electronicWarfareProvider
      ? data.electronicWarfareProvider.map(
          (entry) =>
            new ElectronicWarfareEntry(
              entry.type,
              entry.targetShipId,
              entry.amount
            )
        )
      : [];

    return this;
  }

  getMessages(
    payload: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    previousResponse.push({
      header: "Usage/Output",
      value: this.getUsageVsOutputText(),
    });

    previousResponse.push({
      header: "EW type(s)",
      value: this.allowedEwTypes.map(typeAsString).join(", "),
    });

    return previousResponse;
  }

  getUsageVsOutputText() {
    return this.getTotalEwUsed() + "/" + this.getEwOutput(undefined, 0);
  }

  getValidEwTypes(): EW_TYPE[] {
    return this.allowedEwTypes;
  }

  getEwEntry(type: EW_TYPE, targetId: string) {
    return this.entries.find(
      (entry) => entry.type === type && entry.targetShipId === targetId
    );
  }

  assignEw({
    type,
    target,
    amount,
  }: {
    type: EW_TYPE;
    target: Ship | string;
    amount: number;
  }) {
    if (target instanceof Ship) {
      target = target.getId();
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
    return this.entries.map((entry) => entry.clone());
  }

  canUseEw({ type, amount }: { type: EW_TYPE; amount: number }) {
    return this.canUseEwType(type) && this.canUseEwAmount(amount);
  }

  canUseEwType(type: EW_TYPE) {
    return this.allowedEwTypes.includes(type);
  }

  canUseEwAmount(amount: number) {
    return this.getEwOutput(undefined) >= this.getTotalEwUsed() + amount;
  }

  getUnusedCapacity() {
    return this.getEwOutput(undefined) - this.getTotalEwUsed();
  }

  getTotalEwUsedByType(type: EW_TYPE): number {
    if (type === EW_TYPE.DEFENSIVE) {
      if (!this.canUseEwType(EW_TYPE.DEFENSIVE)) {
        return 0;
      }

      return this.getUnusedCapacity();
    }

    return this.entries
      .filter((entry) => entry.type === type)
      .reduce((total, entry) => total + entry.getAmount(), 0);
  }

  getTotalEwUsed() {
    return this.entries.reduce((total, entry) => total + entry.getAmount(), 0);
  }

  getOutputForBoost(payload: unknown, previousResponse: number = 0) {
    if (previousResponse > this.output) {
      return previousResponse;
    }

    return this.output;
  }

  getEwOutput(payload?: unknown, previousResponse: number = 0) {
    const system = this.getSystem();

    if (system.isDisabled()) {
      return previousResponse;
    }

    let output = this.output;

    output -= (
      system.damage
        .getCriticals()
        .filter(
          (critical) => critical instanceof OutputReduced
        ) as OutputReduced[]
    ).reduce((total, current) => total + current.getOutputReduction(), 0);

    return (
      previousResponse +
      system.callHandler(SYSTEM_HANDLERS.getBoost, null, 0) +
      output
    );
  }

  isEwArray(payload: unknown, previousResponse = false) {
    return true;
  }

  resetEw() {
    this.entries = [];
  }

  getPossibleCriticals(
    payload: unknown,
    previousResponse: CriticalTableEntry[] = []
  ): CriticalTableEntry[] {
    return [
      ...previousResponse,
      { severity: 20, critical: new OutputReduced(1) },
      {
        severity: 40,
        critical: new OutputReduced(Math.ceil(this.output / 4), 2),
      },
      {
        severity: 50,
        critical: new OutputReduced(Math.ceil(this.output / 3), 2),
      },

      {
        severity: 60,
        critical: new OutputReduced(Math.ceil(this.output / 2), 2),
      },
      { severity: 80, critical: new OutputReduced(Math.ceil(this.output / 4)) },
      { severity: 90, critical: new OutputReduced(Math.ceil(this.output / 3)) },
      {
        severity: 100,
        critical: new OutputReduced(Math.ceil(this.output / 2)),
      },
    ];
  }

  censorForUser({ mine }: { mine: boolean }) {
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
