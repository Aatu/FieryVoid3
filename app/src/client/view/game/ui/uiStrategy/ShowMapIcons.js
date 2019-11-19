import AnimationUiStrategy from "./AnimationUiStrategy";
import {
  COLOR_FRIENDLY,
  COLOR_ENEMY,
  ZOOM_FOR_MAPICONS,
  ZOOM_MAX
} from "../../../../../model/gameConfig.mjs";

class ShowMapIcons extends AnimationUiStrategy {
  constructor() {
    super();

    this.showingIcons = false;
  }

  showIcons() {
    this.changeScale(1);
    const { shipIconContainer, currentUser } = this.services;
    shipIconContainer.getArray().forEach(icon => {
      const color = icon.ship.player.isUsers(currentUser)
        ? COLOR_FRIENDLY
        : COLOR_ENEMY;

      const ghost = shipIconContainer.getGhostShipIconByShip(icon.ship);
      ghost.showMapIcon(color);
      icon.showMapIcon(color);
    });
    this.showingIcons = true;
  }

  hideIcons() {
    this.changeScale(1);
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(icon => {
      icon.hideMapIcon();
      const ghost = shipIconContainer.getGhostShipIconByShip(icon.ship);
      ghost.hideMapIcon();
    });

    this.showingIcons = false;
  }

  changeScale(scale) {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(icon => {
      icon.mapIcon.setScale(scale);
      const ghost = shipIconContainer.getGhostShipIconByShip(icon.ship);
      ghost.mapIcon.setScale(scale);
    });
  }

  render({ zoom }) {
    if (zoom > ZOOM_FOR_MAPICONS && !this.showingIcons) {
      this.showIcons();
    }

    if (zoom <= ZOOM_FOR_MAPICONS && this.showingIcons) {
      this.hideIcons();
    }

    if (zoom > ZOOM_FOR_MAPICONS) {
      /*
      const extraScale =
        ((zoom - ZOOM_FOR_MAPICONS) / (ZOOM_MAX - ZOOM_FOR_MAPICONS)) * 5 + 1;
        */

      const extraScale = zoom;

      this.changeScale(extraScale);
    }
  }

  deactivate() {
    super.deactivate();
    this.hideIcons();
  }
}

export default ShowMapIcons;
