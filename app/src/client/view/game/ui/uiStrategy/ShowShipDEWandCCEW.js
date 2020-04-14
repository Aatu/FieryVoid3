import UiStrategy from "./UiStrategy";

class ShowShipDEWandCCEW extends UiStrategy {
  constructor() {
    super();
  }

  update(gamedata) {
    super.update(gamedata);
    const { shipIconContainer } = this.services;

    shipIconContainer.getArray().forEach(async (icon) => {
      await icon.isShipObjectLoaded;
      const ship = icon.ship;
      this.show(ship);
    });
  }

  shipStateChanged(ship) {
    this.show(ship);
  }

  //shipSystemStateChanged({ ship, system }) {}

  show(ship) {
    const { shipIconContainer } = this.services;
    const icon = shipIconContainer.getByShip(ship);

    const dew = ship.electronicWarfare.getDefensiveEw();
    const ccew = ship.electronicWarfare.getCcEw();

    icon.showEwSprite(dew, ccew);
  }

  deactivate() {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach((icon) => {
      icon.hideEwSprite();
    }, this);

    return super.deactivate();
  }
}

export default ShowShipDEWandCCEW;
