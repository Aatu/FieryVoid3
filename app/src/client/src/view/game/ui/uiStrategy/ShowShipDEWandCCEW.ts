import GameData from "@fieryvoid3/model/src/game/GameData";
import UiStrategy from "./UiStrategy";
import Ship from "@fieryvoid3/model/src/unit/Ship";

class ShowShipDEWandCCEW extends UiStrategy {
  constructor() {
    super();
  }

  update(gamedata: GameData) {
    super.update(gamedata);
    const { shipIconContainer } = this.getServices();

    shipIconContainer.getArray().forEach(async (icon) => {
      await icon.isLoaded.promise;
      const ship = icon.ship;
      this.show(ship);
    });
  }

  shipStateChanged(ship: Ship) {
    this.show(ship);
  }

  //shipSystemStateChanged({ ship, system }) {}

  show(ship: Ship) {
    const { shipIconContainer, currentUser } = this.getServices();
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
    const { shipIconContainer } = this.getServices();
    shipIconContainer.getArray().forEach((icon) => {
      icon.hideEwSprite();
    }, this);

    return super.deactivate();
  }
}

export default ShowShipDEWandCCEW;
