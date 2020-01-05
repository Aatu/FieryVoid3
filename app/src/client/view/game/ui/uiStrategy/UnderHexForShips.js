import UiStrategy from "./UiStrategy";
import {
  COLOR_FRIENDLY,
  COLOR_ENEMY,
  ZOOM_FOR_MAPICONS
} from "../../../../../model/gameConfig.mjs";

class UnderHexForShips extends UiStrategy {
  constructor() {
    super();

    this.showing = false;
  }

  show() {
    const { shipIconContainer, currentUser } = this.services;
    shipIconContainer.getArray().forEach(icon => {
      icon.hexSpriteContainer.visible = true;
      const color = icon.ship.player.isUsers(currentUser)
        ? COLOR_FRIENDLY
        : COLOR_ENEMY;

      icon.hexSprites.forEach(sprite => sprite.setOverlayColor(color));
      icon.line.setColor(color);
      icon.line.show();
    });

    this.showing = true;
  }

  hide() {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(icon => {
      icon.hexSpriteContainer.visible = false;

      icon.line.hide();
    });

    this.showing = false;
  }

  update(gameData) {
    super.update(gameData);
    this.show();
  }

  render({ zoom }) {
    if (zoom > ZOOM_FOR_MAPICONS && this.showing) {
      this.hide();
    }

    if (zoom <= ZOOM_FOR_MAPICONS && !this.showing) {
      this.show();
    }
  }

  deactivate() {
    this.hide();
  }
}

export default UnderHexForShips;
