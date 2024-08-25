import AnimationUiStrategy from "./AnimationUiStrategy";
import ShipDamageAnimation from "../../animation/ShipDamageAnimation";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import GameData from "@fieryvoid3/model/src/game/GameData";
import {
  ShipIdleMovementAnimation,
  ShipSystemAnimation,
} from "../../animation";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";

class ShowShipObjects extends AnimationUiStrategy {
  constructor() {
    super();
  }

  async update(gamedata: GameData) {
    super.update(gamedata);
    const { shipIconContainer } = this.getServices();

    await shipIconContainer.shipsLoaded();

    shipIconContainer.getArray().forEach((icon) => {
      const ship = icon.ship;

      if (ship.isDestroyed()) {
        icon.hide();
      } else {
        icon.show();
        this.animations.push(new ShipIdleMovementAnimation(icon));
        this.animations.push(new ShipSystemAnimation(icon));
        this.animations.push(new ShipDamageAnimation(icon, []));
      }
      return this;
    });
  }

  shipStateChanged({ ship }: { ship: Ship }) {
    this.animations
      .filter(
        (animation) => (animation as unknown as { ship: Ship })?.ship === ship
      )
      .forEach((animation) => {
        animation.update(this.getGameData());
      });
  }

  shipSystemStateChanged({ ship, system }: { ship: Ship; system: ShipSystem }) {
    this.animations
      .filter(
        (animation) => (animation as unknown as { ship: Ship })?.ship === ship
      )
      .forEach((animation) => {
        // @ts-expect-error TODO fix this
        if (animation.updateSystem) {
          // @ts-expect-error TODO fix this
          animation.updateSystem(system);
        }
      });
  }

  deactivate() {
    const { shipIconContainer } = this.getServices();
    shipIconContainer.getArray().forEach((icon) => {
      icon.hide();
    }, this);

    return super.deactivate();
  }
}

export default ShowShipObjects;
