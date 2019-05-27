import UiStrategy from "./UiStrategy";

class MouseOverShowsShipTooltip extends UiStrategy {
  shipClicked(payload) {
    const { uiState } = this.services;
    uiState.openShipWindow(payload.entity.ship);
  }

  mouseOverShip(payload) {
    const { uiState } = this.services;
    uiState.openShipWindow(payload.entity.ship);
  }

  mouseOutShip(payload) {
    const { uiState } = this.services;
    uiState.closeShipWindow(payload.entity.ship);
  }
}

export default MouseOverShowsShipTooltip;
