import {
  COLOR_ENEMY,
  COLOR_FRIENDLY,
  ZOOM_FOR_MAPICONS,
} from "@fieryvoid3/model/src/config/gameConfig";
import UiStrategy from "./UiStrategy";
import GameData from "@fieryvoid3/model/src/game/GameData";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

class UnderHexForShips extends UiStrategy {
  private showing: boolean = false;

  show() {
    const { shipIconContainer, currentUser } = this.getServices();
    shipIconContainer.getArray().forEach((icon) => {
      icon.hexSpriteContainer.visible = true;
      const color = icon.ship.player.isUsers(currentUser)
        ? COLOR_FRIENDLY
        : COLOR_ENEMY;

      icon.hexSprites.forEach((sprite) => sprite.setOverlayColor(color));
      icon.line?.setColor(color);
      icon.line?.show();
    });

    this.showing = true;
  }

  hide() {
    const { shipIconContainer } = this.getServices();
    shipIconContainer.getArray().forEach((icon) => {
      icon.hexSpriteContainer.visible = false;

      icon.line?.hide();
    });

    this.showing = false;
  }

  update(gameData: GameData) {
    super.update(gameData);
    this.show();
  }

  render({ zoom }: RenderPayload) {
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
