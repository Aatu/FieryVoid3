import UiStrategy from "./UiStrategy";

class MouseOverShowsShipTooltip extends UiStrategy {
  constructor() {
    super();

    this.clickedShip = null;
    this.mouseOveredShip = null;
  }

  shipStateChanged(ship) {
    const { uiState, shipIconContainer } = this.services;
    if (this.clickedShip === ship) {
      uiState.showShipTooltip(shipIconContainer.getByShip(ship), true);
    }
  }

  deactivate() {
    const { uiState } = this.services;
    if (this.clickedShip) {
      uiState.hideShipTooltip(this.clickedShip);
    }
  }

  shipClicked(payload) {
    const { uiState } = this.services;

    if (this.clickedShip) {
      uiState.hideShipTooltip(this.clickedShip);
    }

    uiState.showShipTooltip(payload.entity, true);
    this.clickedShip = payload.entity.ship;
  }

  hexClicked() {
    if (!this.clickedShip) {
      return;
    }

    const { uiState } = this.services;

    if (uiState.state.systemMenu.activeSystem) {
      return;
    }

    uiState.hideShipTooltip(this.clickedShip);
    this.clickedShip = null;
  }

  mouseOverShip(payload) {
    if (this.clickedShip === payload.entity.ship) {
      return;
    }

    const { uiState } = this.services;

    if (this.mouseOveredShip) {
      uiState.hideShipTooltip(this.mouseOveredShip);
    }

    if (this.clickedShip) {
      uiState.hideShipTooltip(this.clickedShip);
      this.clickedShip = null;
    }

    uiState.showShipTooltip(payload.entity);
    this.mouseOveredShip = payload.entity.ship;
  }

  mouseOutShip(payload) {
    if (this.clickedShip === payload.entity.ship) {
      return;
    }

    const { uiState } = this.services;
    uiState.hideShipTooltip(payload.entity.ship);
    this.mouseOveredShip = null;
  }

  /*
  mouseOut() {
    const { uiState } = this.services;
    if (this.mouseOveredShip && this.mouseOveredShip !== this.clickedShip) {
      uiState.hideShipTooltip(this.mouseOveredShip.ship);
    }

    this.mouseOveredShip = null;
  }
  */
}

export default MouseOverShowsShipTooltip;
