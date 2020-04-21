import ShipSystemStrategy from "./ShipSystemStrategy.mjs";
import { ForcedOffline } from "../criticals/index.mjs";

class RequiresPowerSystemStrategy extends ShipSystemStrategy {
  constructor(power, getsCriticals = true) {
    super();
    this.power = power || 0;
    if (this.power <= 0) {
      throw new Error("Power must be more than zero");
    }

    this.getsCriticals = getsCriticals;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      sort: "AAAA",
      header: "Power requirement",
      value: this.system.callHandler("getPowerRequirement", null, 0),
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

  getTooltipMenuButton({ myShip }, previousResponse = []) {
    if (!myShip) {
      return previousResponse;
    }

    if (this.system.shipSystems.power.canSetOnline(this.system)) {
      return [
        ...previousResponse,
        {
          sort: 0,
          img: "/img/goOnline.png",
          onClickHandler: () => this.system.power.setOnline(),
        },
      ];
    } else if (this.system.shipSystems.power.canSetOffline(this.system)) {
      return [
        ...previousResponse,
        {
          sort: 0,
          img: "/img/goOffline.png",
          onClickHandler: () => this.system.power.setOffline(),
        },
      ];
    }

    return previousResponse;
  }

  getPossibleCriticals(payload, previousResponse = []) {
    if (!this.getsCriticals) {
      return previousResponse;
    }

    return [
      ...previousResponse,
      {
        severity: 20,
        critical: new ForcedOffline(1),
      },
      {
        severity: 40,
        critical: new ForcedOffline(2),
      },
      {
        severity: 60,
        critical: new ForcedOffline(3),
      },
      {
        severity: 80,
        critical: new ForcedOffline(4),
      },
    ];
  }
}

export default RequiresPowerSystemStrategy;
