import UiStrategy from "./UiStrategy";
import {
  COLOR_FRIENDLY,
  COLOR_ENEMY,
  COLOR_FRIENDLY_HIGHLIGHT,
  COLOR_ENEMY_HIGHLIGHT
} from "../../../../../model/gameConfig.mjs";

class MouseOverHighlightsShip extends UiStrategy {
  deactivate(payload) {
    this.hide();
  }

  show(payload) {
    console.log(COLOR_FRIENDLY, COLOR_FRIENDLY_HIGHLIGHT);
    const { currentUser } = this.services;
    if (payload.entity.ship.player.isUsers(currentUser)) {
      payload.entity.replaceEmissive(COLOR_FRIENDLY);
      payload.entity.mapIcon.replaceColor(COLOR_FRIENDLY_HIGHLIGHT);
    } else {
      payload.entity.replaceEmissive(COLOR_ENEMY);
      payload.entity.mapIcon.replaceColor(COLOR_ENEMY_HIGHLIGHT);
    }
  }

  hide() {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(icon => {
      icon.revertEmissive();
      icon.mapIcon.revertColor();
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
