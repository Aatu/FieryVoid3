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
    const { shipIconContainer, currentUser } = this.services;
    const icon = shipIconContainer.getByShip(ship);

    let dew, ccew, evasion;

    if (ship.player.isUsers(currentUser)) {
      dew = ship.electronicWarfare.getDefensiveEw();
      ccew = ship.electronicWarfare.getCcEw();
      evasion = ship.movement.getEvasion();
    } else {
      dew = ship.electronicWarfare.inEffect.getDefensiveEw();
      ccew = ship.electronicWarfare.inEffect.getCcEw();
      evasion = ship.movement.getActiveEvasion();
    }

    icon.showEwSprite(dew, ccew, evasion);
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
