import PowerEntry, { POWER_TYPE, SerializedPowerEntry } from "./PowerEntry";
import ShipSystem from "./ShipSystem";
import { SYSTEM_HANDLERS } from "./strategy/types/SystemHandlersTypes";

export type SerializedSystemPower = {
  entries?: SerializedPowerEntry[];
};

class SystemPower {
  private system: ShipSystem;
  private entries: PowerEntry[];

  constructor(system: ShipSystem) {
    this.system = system;
    this.entries = [];
  }

  serialize() {
    return {
      entries: this.entries.map((entry) => entry.serialize()),
    };
  }

  deserialize(data: SerializedSystemPower = {}) {
    this.entries = data.entries
      ? data.entries.map((entry) => new PowerEntry().deserialize(entry))
      : [];

    return this;
  }

  isOffline() {
    if (this.system.isDestroyed()) {
      return false;
    }

    return (
      (this.entries.some((entry) => entry.isOffline()) ||
        this.isGoingOffline()) &&
      !this.isGoingOnline()
    );
  }

  isOnline() {
    return !this.isOffline();
  }

  isGoingOnline() {
    return this.entries.some((entry) => entry.isGoingOnline());
  }

  isGoingOffline() {
    return this.entries.some((entry) => entry.isGoingOffline());
  }

  forceOffline() {
    if (this.isOffline() || !this.canSetOffline()) {
      return;
    }

    this.entries = this.entries.filter(
      (entry) => entry.type !== POWER_TYPE.GO_ONLINE
    );

    this.entries.push(new PowerEntry(POWER_TYPE.GO_OFFLINE));
  }

  setOffline() {
    this.forceOffline();
    this.system.callHandler(SYSTEM_HANDLERS.onSystemOffline, null, false);
  }

  canSetOffline() {
    return (
      !this.isOffline() &&
      this.system.callHandler(SYSTEM_HANDLERS.canSetOffline, null, false)
    );
  }

  canSetOnline() {
    if (this.system.callHandler(SYSTEM_HANDLERS.shouldBeOffline, null, false)) {
      return false;
    }

    return (
      this.isOffline() &&
      this.system.callHandler(SYSTEM_HANDLERS.canSetOnline, null, false)
    );
  }

  setOnline() {
    if (!this.isOffline()) {
      return;
    }

    this.entries = this.entries.filter(
      (entry) => entry.type !== POWER_TYPE.GO_OFFLINE
    );

    this.entries.push(new PowerEntry(POWER_TYPE.GO_ONLINE));
    this.system.callHandler(
      SYSTEM_HANDLERS.onSystemOnline,
      undefined,
      undefined
    );
  }

  getPowerOutput() {
    return this.system.callHandler(SYSTEM_HANDLERS.getPowerOutput, null, 0);
  }

  getPowerRequirement() {
    return this.system.callHandler(
      SYSTEM_HANDLERS.getPowerRequirement,
      null,
      0
    );
  }

  advanceTurn(turn: number) {
    if (this.isOffline()) {
      this.entries = [new PowerEntry(POWER_TYPE.OFFLINE)];
    } else {
      this.entries = [];
    }
  }
}

export default SystemPower;
