import {
  COLOR_ENEMY,
  COLOR_FRIENDLY,
} from "@fieryvoid3/model/src/config/gameConfig";
import ShipObject from "../../renderer/ships/ShipObject";
import UiStrategy from "./UiStrategy";

class MouseOverHighlightsShip extends UiStrategy {
  deactivate() {
    this.hide();
  }

  show(payload: { entity: ShipObject }) {
    const { currentUser } = this.getServices();
    if (payload.entity.ship.player.isUsers(currentUser)) {
      payload.entity.replaceEmissive(COLOR_FRIENDLY);
    } else {
      payload.entity.replaceEmissive(COLOR_ENEMY);
    }
  }

  hide() {
    const { shipIconContainer } = this.getServices();
    shipIconContainer.getArray().forEach((icon) => {
      icon.revertEmissive();
    });
  }

  mouseOverShip(payload: { entity: ShipObject }) {
    this.show(payload);
  }

  mouseOutShip() {
    this.hide();
  }

  mouseOut() {
    this.hide();
  }
}

export default MouseOverHighlightsShip;
