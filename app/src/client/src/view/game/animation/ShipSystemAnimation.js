import Animation from "./Animation";

class ShipSystemAnimation extends Animation {
  constructor(icon, ship) {
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

  updateSystem(system) {
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
}

export default ShipSystemAnimation;
