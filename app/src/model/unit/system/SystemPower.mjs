import PowerEntry, {
  POWER_TYPE_OFFLINE,
  POWER_TYPE_GO_OFFLINE,
  POWER_TYPE_GO_ONLINE
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
    return this.entries.some(
      entry => entry.isOffline() || entry.isGoingOffline()
    );
  }

  isGoingOnline() {
    return this.entries.some(entry => entry.isGoingOnline());
  }

  isGoingOffline() {
    return this.entries.some(entry => entry.isGoingOffline());
  }

  setOffline() {
    if (this.isOffline() || !this.canSetOffline()) {
      return;
    }

    this.entries.push(new PowerEntry(POWER_TYPE_GO_OFFLINE));
  }

  canSetOffline() {
    return (
      !this.isOffline() && this.system.callHandler("canSetOffline", null, false)
    );
  }

  canSetOnline() {
    return (
      this.isOffline() && this.system.callHandler("canSetOnline", null, false)
    );
  }

  setOnline() {
    if (!this.isOffline()) {
      return;
    }

    const goOffline = this.entries.find(
      entry => entry.type === POWER_TYPE_GO_OFFLINE
    );

    if (goOffline) {
      this.entries = this.entries.filter(entry => entry !== goOffline);
    } else {
      this.entries.push(new PowerEntry(POWER_TYPE_GO_ONLINE));
    }
  }

  getPowerOutput() {
    return this.system.callHandler("getPowerOutput", null, 0);
  }

  getPowerRequirement() {
    return this.system.callHandler("getPowerRequirement", null, 0);
  }

  advanceTurn() {
    if (this.isOffline()) {
      this.entries = [new PowerEntry(POWER_TYPE_OFFLINE)];
    } else {
      this.entries = [];
    }
  }
}

export default SystemPower;
