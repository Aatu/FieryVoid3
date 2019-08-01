import Animation from "./Animation";

class ShipSystemAnimation extends Animation {
  constructor(icon) {
    super();
    this.icon = icon;
    this.ship = icon.ship;
  }

  update() {
    this.ship.systems.getSystems().forEach(system => {
      if (system.power.isGoingOffline()) {
        this.icon.disableSystemAnimation(system, "online");
        this.icon.playSystemAnimation(system, "offline");
      } else if (system.power.isGoingOnline()) {
        this.icon.disableSystemAnimation(system, "offline");
        this.icon.playSystemAnimation(system, "online");
      } else if (system.power.isOffline()) {
        this.icon.disableSystemAnimation(system, "online");
        this.icon.setSystemAnimation(system, "offline", 100);
      } else if (system.power.isOnline()) {
        this.icon.disableSystemAnimation(system, "offline");
        this.icon.setSystemAnimation(system, "online", 100);
      }
    });

    return this;
  }
}

export default ShipSystemAnimation;
