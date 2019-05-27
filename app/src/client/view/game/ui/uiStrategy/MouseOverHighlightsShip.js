import UiStrategy from "./UiStrategy";
import * as THREE from "three";

class MouseOverHighlightsShip extends UiStrategy {
  deactivate(payload) {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(icon => icon.revertEmissive());
  }

  mouseOverShip(payload) {
    const { currentUser } = this.services;

    if (payload.entity.ship.player.isUsers(currentUser)) {
      payload.entity.replaceEmissive(
        new THREE.Color(39 / 255, 196 / 255, 39 / 255)
      );
    } else {
      payload.entity.replaceEmissive(
        new THREE.Color(196 / 255, 39 / 255, 39 / 255)
      );
    }
  }

  mouseOutShip(payload) {
    payload.entity.revertEmissive();
  }
}

export default MouseOverHighlightsShip;
