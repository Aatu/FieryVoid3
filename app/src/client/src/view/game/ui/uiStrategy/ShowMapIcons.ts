import {
  COLOR_ENEMY,
  COLOR_ENEMY_HIGHLIGHT,
  COLOR_FRIENDLY,
  COLOR_FRIENDLY_HIGHLIGHT,
  ZOOM_FOR_MAPICONS,
} from "@fieryvoid3/model/src/config/gameConfig";
import ShipObject from "../../renderer/ships/ShipObject";
import AnimationUiStrategy from "./AnimationUiStrategy";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

class ShowMapIcons extends AnimationUiStrategy {
  private zoom: number = 1;
  private showingIcons: boolean = false;

  showHighligh(icon: ShipObject) {
    const { currentUser } = this.getServices();
    const color = icon.ship.player.isUsers(currentUser)
      ? COLOR_FRIENDLY_HIGHLIGHT
      : COLOR_ENEMY_HIGHLIGHT;

    icon.mapIcon?.replaceColor(color);
  }

  hideHighligh() {
    const { shipIconContainer } = this.getServices();
    shipIconContainer.getArray().forEach((icon) => {
      const ghost = shipIconContainer.getGhostShipIconByShip(icon.ship);
      ghost.mapIcon?.revertColor();
      icon.mapIcon?.revertColor();
    });
  }

  mouseOverShip(payload: { entity: ShipObject }) {
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
    const { shipIconContainer, currentUser, gameCamera } = this.getServices();
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
    const { shipIconContainer, gameCamera } = this.getServices();
    shipIconContainer.getArray().forEach((icon) => {
      icon.hideMapIcon();
      const ghost = shipIconContainer.getGhostShipIconByShip(icon.ship);
      ghost.hideMapIcon();
    });

    this.showingIcons = false;
    gameCamera.changeToCloseView();
  }

  changeScale(scale: number) {
    const { shipIconContainer } = this.getServices();
    shipIconContainer.getArray().forEach((icon) => {
      icon.mapIcon?.setScale(scale);
      const ghost = shipIconContainer.getGhostShipIconByShip(icon.ship);
      ghost.mapIcon?.setScale(scale);
    });
  }

  shouldShow(zoom: number, force: boolean = false) {
    if (!this.getServices()) {
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

  render({ zoom }: RenderPayload) {
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
