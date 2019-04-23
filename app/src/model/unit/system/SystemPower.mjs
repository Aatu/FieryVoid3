import PowerEntry, {
  POWER_TYPE_OFFLINE
  //POWER_TYPE_BOOST
} from "./PowerEntry.mjs";

class SystemPower {
  constructor(system) {
    this.system = system;
    this.entries = [];
  }

  serialize() {
    return {
      entries: this.entries.map(entry => entry.serialize())
    };
  }

  deserialize(data) {
    this.entries = data.entries
      ? data.entries.map(entry => new PowerEntry().deserialize(entry))
      : [];

    return this;
  }

  isOffline() {
    return this.entries.some(entry => entry.isOffline());
  }

  setOffline() {
    if (this.isOffline() || !this.canSetOffline()) {
      return;
    }

    this.entries.push(new PowerEntry(POWER_TYPE_OFFLINE));
  }

  canSetOffline() {
    return (
      this.isOffline() || this.system.callHandler("canSetOffline", null, false)
    );
  }

  setOnline() {
    if (!this.isOffline()) {
      return;
    }

    this.entries = this.entries.filter(entry => !entry.isOffline());
  }

  getPowerOutput() {
    return this.system.callHandler("getPowerOutput", null, 0);
  }

  getPowerRequirement() {
    return this.system.callHandler("getPowerRequirement", null, 0);
  }

  advanceTurn() {}
}

export default SystemPower;
