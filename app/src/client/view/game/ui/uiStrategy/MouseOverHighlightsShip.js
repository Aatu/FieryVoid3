import UiStrategy from "./UiStrategy";
import * as THREE from "three";
import {
  COLOR_FRIENDLY,
  COLOR_ENEMY
} from "../../../../../model/gameConfig.mjs";

class MouseOverHighlightsShip extends UiStrategy {
  deactivate(payload) {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(icon => icon.revertEmissive());
  }

  mouseOverShip(payload) {
    const { currentUser } = this.services;

    this.highLighted = payload.entity;

    if (payload.entity.ship.player.isUsers(currentUser)) {
      payload.entity.replaceEmissive(COLOR_FRIENDLY);
    } else {
      payload.entity.replaceEmissive(COLOR_ENEMY);
    }
  }

  mouseOutShip(payload) {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(icon => icon.revertEmissive());
  }

  mouseOut() {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(icon => icon.revertEmissive());
  }
}

export default MouseOverHighlightsShip;
