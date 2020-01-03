import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import { ForcedOffline } from "../criticals/index.mjs";

class RequiresPowerSystemStrategy extends ShipSystemStrategy {
  constructor(power) {
    super();
    this.power = power || 0;
    if (this.power <= 0) {
      throw new Error("Power must be more than zero");
    }
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Power requirement",
      value: this.power
    });

    return previousResponse;
  }

  getPowerRequirement(payload, previousResponse = 0) {
    return this.power + previousResponse;
  }

  canSetOffline(payload, previousResponse = false) {
    return true;
  }

  canSetOnline() {
    return true;
  }

  shouldBeOffline(payload, previousResponse = false) {
    if (previousResponse === true) {
      return true;
    }

    return this.system.hasCritical(ForcedOffline);
  }

  getPossibleCriticals(payload, previousResponse = []) {
    return [
      ...previousResponse,
      {
        severity: 20,
        critical: new ForcedOffline(1)
      },
      {
        severity: 40,
        critical: new ForcedOffline(2)
      },
      {
        severity: 60,
        critical: new ForcedOffline(3)
      },
      {
        severity: 80,
        critical: new ForcedOffline(4)
      }
    ];
  }
}

export default RequiresPowerSystemStrategy;
