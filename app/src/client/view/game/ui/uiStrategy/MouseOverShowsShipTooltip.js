import UiStrategy from "./UiStrategy";

class MouseOverShowsShipTooltip extends UiStrategy {
  constructor() {
    super();

    this.clickedShip = null;
  }

  shipClicked(payload) {
    const { uiState } = this.services;

    if (this.clickedShip) {
      uiState.hideShipTooltip(this.clickedShip);
    }

    uiState.showShipTooltip(payload.entity.ship, true);
    this.clickedShip = payload.entity.ship;
  }

  hexClicked() {
    if (!this.clickedShip) {
      return;
    }

    const { uiState } = this.services;
    uiState.hideShipTooltip(this.clickedShip);
    this.clickedShip = null;
  }

  mouseOverShip(payload) {
    if (this.clickedShip === payload.entity.ship) {
      return;
    }

    const { uiState } = this.services;
    uiState.showShipTooltip(payload.entity.ship);
  }

  mouseOutShip(payload) {
    if (this.clickedShip === payload.entity.ship) {
      return;
    }

    const { uiState } = this.services;
    uiState.hideShipTooltip(payload.entity.ship);
  }
}

export default MouseOverShowsShipTooltip;
