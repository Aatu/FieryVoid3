import CurrentOEWIndicator from "./CurrentOEWIndicator";

class ShipCurrentEWIndicators {
  constructor(ship, shipIconContainer, currentUser, scene) {
    this.ship = ship;
    this.icon = shipIconContainer.getByShip(ship);
    this.shipIconContainer = shipIconContainer;
    this.currentUser = currentUser;
    this.scene = scene;
    this.oew = [];

    this.update(this.ship);
  }

  update(ship, useGhost) {
    this.ship = ship;
    this.oew = this.createOEW(useGhost);

    return this;
  }

  show() {
    this.oew.forEach(oew => oew.show());
    return this;
  }

  hide() {
    this.oew.forEach(oew => oew.hide());
    return this;
  }

  isShip(ship) {
    return this.ship.id === ship.id;
  }

  render(zoom) {
    this.oew.forEach(oew => oew.render(zoom));
  }

  createOEW() {
    const old = this.oew;
    const newOew = this.ship.electronicWarfare.inEffect
      .getAllOew()
      .map(ewEntry => {
        const targetIcon = this.shipIconContainer.getById(ewEntry.targetShipId);
        const targetGhost = this.shipIconContainer.getGhostShipIconByShip(
          targetIcon.ship
        );
        let indicator = this.oew.find(oew => oew.targetIcon === targetIcon);

        if (!indicator) {
          indicator = new CurrentOEWIndicator(
            this.icon,
            targetIcon,
            targetGhost,
            ewEntry.amount,
            this.ship.player.is(this.currentUser),
            this.scene
          );
        }

        return indicator.update(this.ship, ewEntry.amount);
      });

    old
      .filter(indicator =>
        newOew.every(indicatorNew => indicatorNew !== indicator)
      )
      .forEach(indicator => indicator.remove());

    return newOew;
  }
}

export default ShipCurrentEWIndicators;
