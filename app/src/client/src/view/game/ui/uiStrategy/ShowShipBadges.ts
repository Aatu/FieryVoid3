import Ship from "@fieryvoid3/model/src/unit/Ship";
import AnimationUiStrategy from "./AnimationUiStrategy";
import { ZOOM_FOR_SHIPBADGE } from "@fieryvoid3/model/src/config/gameConfig";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

class ShowShipBadges extends AnimationUiStrategy {
  private zoom: number = 1;
  private showing: boolean = false;
  private showingName: boolean = false;

  /*
  uiStateChanged() {
    this.shouldShow(this.zoom, true);
  }*/

  shipStateChanged(ship: Ship) {
    this.updateShip(ship);
  }

  updateShip(ship: Ship) {
    const { shipIconContainer, uiState } = this.getServices();

    if (ship.isDestroyed()) {
      return;
    }

    const icon = shipIconContainer.getByShip(ship);
    uiState.showShipBadge(icon);
  }

  /*

  mouseOutShip() {
    this.shouldShow(this.zoom, true);
  }
  */

  show(showName: boolean) {
    const { shipIconContainer, uiState } = this.getServices();

    shipIconContainer
      .getArray()
      .filter((icon) => !icon.ship.isDestroyed())
      .forEach((icon) => {
        uiState.showShipBadge(icon, showName);
      });
    this.showing = true;
    this.showingName = showName;
  }

  hide() {
    const { shipIconContainer, uiState } = this.getServices();
    shipIconContainer.getArray().forEach((icon) => {
      uiState.hideShipBadge(icon);
    });
    this.showing = false;
  }

  shouldShow(zoom: number, force: boolean = false) {
    if (!this.getServices()) {
      return;
    }

    if (zoom > ZOOM_FOR_SHIPBADGE && (force || this.showing)) {
      this.hide();
    }

    if (zoom <= ZOOM_FOR_SHIPBADGE) {
      //const showName = zoom <= ZOOM_FOR_SHIPBADGE_NAME;

      if (/* this.showingName !== showName || */ force || !this.showing) {
        this.show(true);
      }
    }
  }

  render({ zoom }: RenderPayload) {
    this.zoom = zoom;

    this.shouldShow(zoom);
  }

  deactivate() {
    const { shipIconContainer, uiState } = this.getServices();
    shipIconContainer.getArray().forEach((icon) => {
      uiState.removeShipBadge(icon);
    });
  }
}

export default ShowShipBadges;
