import AnimationUiStrategy from "./AnimationUiStrategy";
import {
  COLOR_FRIENDLY,
  COLOR_ENEMY,
  ZOOM_FOR_MAPICONS,
  ZOOM_FOR_SHIPBADGE,
  ZOOM_FOR_SHIPBADGE_NAME,
  ZOOM_MAX
} from "../../../../../model/gameConfig.mjs";

class ShowShipBadges extends AnimationUiStrategy {
  constructor() {
    super();

    this.zoom = 1;
    this.showing = false;
    this.showingName = false;
  }

  /*
  uiStateChanged() {
    this.shouldShow(this.zoom, true);
  }*/

  shipStateChanged(ship) {
    this.show(ship);
  }

  updateShip(ship) {
    const { shipIconContainer, uiState } = this.services;
    const icon = shipIconContainer.getByShip(ship);
    uiState.showShipBadge(icon);
  }

  /*

  mouseOutShip() {
    this.shouldShow(this.zoom, true);
  }
  */

  show(showName) {
    const { shipIconContainer, uiState } = this.services;

    shipIconContainer.getArray().forEach(icon => {
      uiState.showShipBadge(icon, showName);
    });
    this.showing = true;
    this.showingName = showName;
  }

  hide() {
    const { shipIconContainer, uiState } = this.services;
    shipIconContainer.getArray().forEach(icon => {
      uiState.hideShipBadge(icon);
    });
    this.showing = false;
  }

  shouldShow(zoom, force = false) {
    if (!this.services) {
      return;
    }

    if (zoom > ZOOM_FOR_SHIPBADGE && (force || this.showing)) {
      this.hide();
    }

    if (zoom <= ZOOM_FOR_SHIPBADGE) {
      //const showName = zoom <= ZOOM_FOR_SHIPBADGE_NAME;

      if (/* this.showingName !== showName || */ force || !this.showing) {
        this.show(/* showName */);
      }
    }
  }

  render({ zoom }) {
    this.zoom = zoom;

    this.shouldShow(zoom);
  }

  deactivate() {
    this.hide();
  }
}

export default ShowShipBadges;
