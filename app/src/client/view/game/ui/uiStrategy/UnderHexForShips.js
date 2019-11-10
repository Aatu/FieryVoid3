import UiStrategy from "./UiStrategy";
import {
  COLOR_FRIENDLY,
  COLOR_ENEMY
} from "../../../../../model/gameConfig.mjs";

class UnderHexForShips extends UiStrategy {
  update(gameData) {
    super.update(gameData);
    const { shipIconContainer, currentUser } = this.services;
    shipIconContainer.getArray().forEach(icon => {
      icon.hexSpriteContainer.visible = true;
      const color = icon.ship.player.isUsers(currentUser)
        ? COLOR_FRIENDLY
        : COLOR_ENEMY;

      icon.hexSprites.forEach(sprite => sprite.setOverlayColor(color));
    });
  }

  deactivate() {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(icon => {
      icon.hexSpriteContainer.visible = false;
    });
  }
}

export default UnderHexForShips;
