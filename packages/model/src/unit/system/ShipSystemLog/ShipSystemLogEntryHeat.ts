import ShipSystemLogEntry, {
  SerializedSystemLogEntry,
} from "./ShipSystemLogEntry";
import { formatNumber } from "../../../utils/format";
import ShipSystem from "../ShipSystem";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";

export type SerializedShipSystemLogEntryHeat = SerializedSystemLogEntry & {
  initialOverheat?: number;
  initialOverheatPercentage?: number;
  heatGenerated?: number;
  heatCooled?: number;
  heatRadiated?: number;
  overheat?: number;
  overheatPercentage?: number;
  isForcedOffline?: boolean;
  intialHeatStored?: number;
  newHeatStored?: number;
  heatGivenToRadiators?: number;
};

class ShipSystemLogEntryHeat extends ShipSystemLogEntry {
  private initialOverheat: number;
  private initialOverheatPercentage: number;
  private heatGenerated: number;
  private heatCooled: number;
  private heatRadiated: number;
  private overheat: number;
  private overheatPercentage: number;
  private isForcedOffline: boolean;
  private intialHeatStored: number;
  private newHeatStored: number;
  private heatGivenToRadiators: number;

  constructor(system: ShipSystem) {
    super(system);

    this.initialOverheat = 0;
    this.initialOverheatPercentage = 0;
    this.heatGenerated = 0;
    this.heatCooled = 0;
    this.heatRadiated = 0;
    this.overheat = 0;
    this.overheatPercentage = 0;
    this.isForcedOffline = false;
    this.intialHeatStored = 0;
    this.newHeatStored = 0;
    this.heatGivenToRadiators = 0;
  }

  setIntialHeatStored(heat: number) {
    this.intialHeatStored = heat;
  }

  addNewHeatStored(amount: number) {
    this.newHeatStored += amount;
  }

  addHeatGivenToRadiators(amount: number) {
    this.heatGivenToRadiators += amount;
  }

  setInitialOverheat(heat: number, percentage: number) {
    this.initialOverheat = heat;
    this.initialOverheatPercentage = percentage;
  }

  setHeatGenerated(heat: number) {
    this.heatGenerated = heat;
  }

  setNewOverheat(heat: number, percentage: number) {
    this.overheat = heat;
    this.overheatPercentage = percentage;

    this.heatCooled = this.heatGenerated + this.initialOverheat - this.overheat;
  }

  setHeatRadiated(heat: number) {
    this.heatRadiated = heat;
  }

  setForcedOffline() {
    this.isForcedOffline = true;
  }

  serialize() {
    return {
      ...super.serialize(),
      initialOverheat: this.initialOverheat,
      initialOverheatPercentage: this.initialOverheatPercentage,
      heatGenerated: this.heatGenerated,
      heatCooled: this.heatCooled,
      heatRadiated: this.heatRadiated,
      overheat: this.overheat,
      overheatPercentage: this.overheatPercentage,
      isForcedOffline: this.isForcedOffline,
      intialHeatStored: this.intialHeatStored,
      newHeatStored: this.newHeatStored,
      heatGivenToRadiators: this.heatGivenToRadiators,
    };
  }

  deserialize(data: SerializedShipSystemLogEntryHeat = {}) {
    super.deserialize(data);
    this.initialOverheat = data.initialOverheat || 0;
    this.initialOverheatPercentage = data.initialOverheatPercentage || 0;
    this.heatGenerated = data.heatGenerated || 0;
    this.heatCooled = data.heatCooled || 0;
    this.heatRadiated = data.heatRadiated || 0;
    this.overheat = data.overheat || 0;
    this.overheatPercentage = data.overheatPercentage || 0;
    this.isForcedOffline = data.isForcedOffline || false;
    this.intialHeatStored = data.intialHeatStored || 0;
    this.newHeatStored = data.newHeatStored || 0;
    this.heatGivenToRadiators = data.heatGivenToRadiators || 0;

    return this;
  }

  getMessage(): string[] {
    let messages: string[] = [];

    const isRadiator = this.system.callHandler(
      SYSTEM_HANDLERS.isRadiator,
      null,
      false
    );

    const isStorage = this.system.heat.isHeatStorage();

    if (isStorage) {
      messages = [...messages, ...this.getHeatStorageMessage()];
    }

    if (isRadiator) {
      messages = [...messages, ...this.getRadiatorMessage()];
    }

    if (!isRadiator && !isStorage) {
      messages = [...messages, ...this.getRegularMessage()];
    }

    return messages;
  }

  getRadiatorMessage() {
    if (this.heatRadiated) {
      return [`Radiated ${formatNumber(this.heatRadiated)} units of heat.`];
    }

    return [];
  }

  getHeatStorageMessage() {
    const messages = [];

    if (this.heatGivenToRadiators || this.newHeatStored) {
      messages.push(
        `Added ${formatNumber(
          this.newHeatStored
        )} units of heat. Transfered ${formatNumber(
          this.heatGivenToRadiators
        )} units of heat to radiators.`
      );
    }

    messages.push(
      `Stored ${formatNumber(
        this.intialHeatStored + this.newHeatStored - this.heatGivenToRadiators
      )} units of heat.`
    );

    return messages;
  }

  getRegularMessage() {
    const messages = [];

    if (this.heatGenerated || this.heatCooled) {
      messages.push(
        `Added ${formatNumber(this.heatGenerated)} and cooled ${formatNumber(
          this.heatCooled
        )} units of heat.`
      );
    }

    let heatMessage = `Current system heat was ${formatNumber(this.overheat)}.`;

    messages.push();

    if (this.overheat) {
      heatMessage += ` Overheating ${Math.round(
        this.overheatPercentage * 100
      )}%.`;
    }

    messages.push(heatMessage);
    if (this.isForcedOffline) {
      messages.push(`System forced offline until overheat is less than 50%.`);
    }

    return messages;
  }
}

export default ShipSystemLogEntryHeat;
