import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipObject from "../renderer/ships/ShipObject";
import Animation from "./Animation";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";

class ShipSystemAnimation extends Animation {
  private icon: ShipObject;
  private ship: Ship;

  constructor(icon: ShipObject, ship: Ship) {
    super();
    this.icon = icon;
    this.ship = ship || icon.ship;

    this.updateAll();
  }

  updateAll() {
    this.ship.systems
      .getSystems()
      .forEach((system) => this.updateSystem(system));
  }

  updateSystem(system: ShipSystem) {
    if (system.power.isGoingOffline()) {
      this.icon.disableSystemAnimation(system, "online");
      this.icon.playSystemAnimation(system, "offline");
    } else if (system.power.isGoingOnline()) {
      this.icon.disableSystemAnimation(system, "offline");
      this.icon.playSystemAnimation(system, "online");
    } else if (system.isDisabled()) {
      this.icon.disableSystemAnimation(system, "online");
      this.icon.setSystemAnimation(system, "offline", 100);
    } else if (system.power.isOffline()) {
      this.icon.disableSystemAnimation(system, "online");
      this.icon.setSystemAnimation(system, "offline", 100);
    } else if (system.power.isOnline()) {
      this.icon.disableSystemAnimation(system, "offline");
      this.icon.setSystemAnimation(system, "online", 100);
    }

    return this;
  }

  update(): void {}

  render(): void {}
}

export default ShipSystemAnimation;
