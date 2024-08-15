import AnimationUiStrategy from "./AnimationUiStrategy";
import {
  COLOR_FRIENDLY,
  COLOR_ENEMY,
  ZOOM_FOR_MAPICONS,
  COLOR_FRIENDLY_HIGHLIGHT,
  COLOR_ENEMY_HIGHLIGHT,
  ZOOM_MAX,
} from "../../../../../model/gameConfig";

class ShowMapIcons extends AnimationUiStrategy {
  constructor() {
    super();

    this.zoom = 1;
    this.showingIcons = false;
  }

  showHighligh(icon) {
    const { currentUser } = this.services;
    const color = icon.ship.player.isUsers(currentUser)
      ? COLOR_FRIENDLY_HIGHLIGHT
      : COLOR_ENEMY_HIGHLIGHT;

    icon.mapIcon.replaceColor(color);
  }

  hideHighligh() {
    const { shipIconContainer, currentUser } = this.services;
    shipIconContainer.getArray().forEach((icon) => {
      const ghost = shipIconContainer.getGhostShipIconByShip(icon.ship);
      ghost.mapIcon.revertColor();
      icon.mapIcon.revertColor();
    });
  }

  mouseOverShip(payload) {
    const icon = payload.entity;
    this.showHighligh(icon);
  }

  uiStateChanged() {
    this.shouldShow(this.zoom, true);
  }

  shipStateChanged() {
    this.shouldShow(this.zoom, true);
  }

  mouseOutShip() {
    this.hideHighligh();
    this.shouldShow(this.zoom, true);
  }

  mouseOut() {
    this.hideHighligh();
  }

  showIcons() {
    this.changeScale(1);
    const { shipIconContainer, currentUser, gameCamera } = this.services;
    shipIconContainer.getArray().forEach((icon) => {
      const color = icon.ship.player.isUsers(currentUser)
        ? COLOR_FRIENDLY
        : COLOR_ENEMY;

      const ghost = shipIconContainer.getGhostShipIconByShip(icon.ship);
      ghost.showMapIcon(color);
      icon.showMapIcon(color);
    });
    this.showingIcons = true;
    gameCamera.changeToMapView();
  }

  hideIcons() {
    this.changeScale(1);
    const { shipIconContainer, gameCamera } = this.services;
    shipIconContainer.getArray().forEach((icon) => {
      icon.hideMapIcon();
      const ghost = shipIconContainer.getGhostShipIconByShip(icon.ship);
      ghost.hideMapIcon();
    });

    this.showingIcons = false;
    gameCamera.changeToCloseView();
  }

  changeScale(scale) {
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach((icon) => {
      icon.mapIcon.setScale(scale);
      const ghost = shipIconContainer.getGhostShipIconByShip(icon.ship);
      ghost.mapIcon.setScale(scale);
    });
  }

  shouldShow(zoom, force = false) {
    if (!this.services) {
      return;
    }

    if (zoom > ZOOM_FOR_MAPICONS && (force || !this.showingIcons)) {
      this.showIcons();
    }

    if (zoom <= ZOOM_FOR_MAPICONS && (force || this.showingIcons)) {
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

  render({ zoom }) {
    if (zoom === this.zoom) {
      return;
    }

    this.zoom = zoom;

    this.shouldShow(zoom);
  }

  deactivate() {
    super.deactivate();
    this.hideIcons();
  }
}

export default ShowMapIcons;
