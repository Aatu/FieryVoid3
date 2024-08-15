import UiStrategy from "./UiStrategy";
import {
  COLOR_FRIENDLY,
  COLOR_ENEMY,
  COLOR_FRIENDLY_HIGHLIGHT,
  COLOR_ENEMY_HIGHLIGHT,
} from "../../../../../model/gameConfig";

class MouseOverHighlightsShip extends UiStrategy {
  deactivate(payload) {
    this.hide();
  }

  show(payload) {
    const { currentUser } = this.services;
    if (payload.entity.ship.player.isUsers(currentUser)) {
      payload.entity.replaceEmissive(COLOR_FRIENDLY);
    } else {
      payload.entity.replaceEmissive(COLOR_ENEMY);
    }
  }

  hide() {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach((icon) => {
      icon.revertEmissive();
    });
  }

  mouseOverShip(payload) {
    this.show(payload);
  }

  mouseOutShip(payload) {
    this.hide();
  }

  mouseOut() {
    this.hide();
  }
}

export default MouseOverHighlightsShip;
