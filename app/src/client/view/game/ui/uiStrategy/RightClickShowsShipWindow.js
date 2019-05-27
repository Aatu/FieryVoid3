import UiStrategy from "./UiStrategy";

class RightClickShowsShipWindow extends UiStrategy {
  shipRightClicked(payload) {
    const { uiState } = this.services;
    uiState.openShipWindow(payload.entity.ship);
  }
}

export default RightClickShowsShipWindow;
