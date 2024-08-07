import ShipSystemStrategy from "./ShipSystemStrategy.js";
import { ForcedOffline } from "../criticals/index.js";
import { SYSTEM_HANDLERS, SystemMessage } from "./types/SystemHandlersTypes.js";

class RequiresPowerSystemStrategy extends ShipSystemStrategy {
  private power: number;
  private getsCriticals: boolean;

  constructor(power: number, getsCriticals = true) {
    super();
    this.power = power || 0;
    if (this.power <= 0) {
      throw new Error("Power must be more than zero");
    }

    this.getsCriticals = getsCriticals;
  }

  getMessages(
    payload: unknown,
    previousResponse: SystemMessage[] = []
  ): SystemMessage[] {
    previousResponse.push({
      sort: "AAAA",
      header: "Power requirement",
      value: this.getSystem().callHandler(
        SYSTEM_HANDLERS.getPowerRequirement,
        null,
        0
      ),
    });

    return previousResponse;
  }

  getPowerRequirement(payload: unknown, previousResponse = 0) {
    return this.power + previousResponse;
  }

  canSetOffline(payload: unknown, previousResponse = false) {
    return true;
  }

  canSetOnline() {
    return true;
  }

  shouldBeOffline(payload: unknown, previousResponse = false) {
    if (previousResponse === true) {
      return true;
    }

    return this.getSystem().hasCritical(ForcedOffline);
  }

  getTooltipMenuButton({ myShip }: { myShip: boolean }, previousResponse = []) {
    if (!myShip) {
      return previousResponse;
    }

    const system = this.getSystem();

    if (system.getShipSystems().power.canSetOnline(system)) {
      return [
        ...previousResponse,
        {
          sort: 0,
          img: "/img/goOnline.png",
          onClickHandler: () => system.power.setOnline(),
        },
      ];
    } else if (system.getShipSystems().power.canSetOffline(system)) {
      return [
        ...previousResponse,
        {
          sort: 0,
          img: "/img/goOffline.png",
          onClickHandler: () => system.power.setOffline(),
        },
      ];
    }

    return previousResponse;
  }

  getPossibleCriticals(payload: unknown, previousResponse = []) {
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
