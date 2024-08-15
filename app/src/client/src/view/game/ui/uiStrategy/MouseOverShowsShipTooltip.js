import UiStrategy from "./UiStrategy";

class MouseOverShowsShipTooltip extends UiStrategy {
  constructor() {
    super();

    this.clickedShip = null;
    this.clickedEnemy = null;
    this.mouseOveredShip = null;
  }

  shipTooltipClosed(ship) {
    if (this.clickedShip === ship) {
      this.clickedShip = null;
    }

    if (this.clickedEnemy === ship) {
      this.clickedEnemy = null;
    }
  }

  shipStateChanged(ship) {
    const { uiState, shipIconContainer, currentUser } = this.services;

    const isMine = ship.player.is(currentUser);

    if (this.clickedShip === ship) {
      uiState.showShipTooltip(ship, true, isMine);
    }
    if (this.clickedEnemy === ship) {
      uiState.showShipTooltip(ship, true, isMine);
    }
  }

  deactivate() {
    const { uiState } = this.services;
    if (this.clickedShip) {
      uiState.hideShipTooltip(this.clickedShip);
    }

    if (this.clickedEnemy) {
      uiState.hideShipTooltip(this.clickedEnemy);
    }
  }

  shipClicked(payload) {
    const { uiState, currentUser } = this.services;

    const ship = payload.entity.ship;
    const isMine = ship.player.is(currentUser);

    if (isMine && this.clickedShip) {
      uiState.hideShipTooltip(this.clickedShip);
    }

    if (!isMine && this.clickedEnemy) {
      uiState.hideShipTooltip(this.clickedEnemy);
    }

    uiState.showShipTooltip(payload.entity.ship, true, isMine);
    if (isMine) {
      this.clickedShip = ship;
    } else {
      this.clickedEnemy = ship;
    }

    if (
      this.mouseOveredShip === this.clickedShip ||
      this.mouseOveredShip === this.clickedEnemy
    ) {
      this.mouseOveredShip = null;
    }
  }
  /*
  hexClicked() {
    const { uiState } = this.services;

    if (uiState.state.systemMenu.activeSystem) {
      return;
    }

    if (this.clickedShip) {
      uiState.hideShipTooltip(this.clickedShip);
      this.clickedShip = null;
    }

    if (this.clickedEnemy) {
      uiState.hideShipTooltip(this.clickedEnemy);
      this.clickedEnemy = null;
    }
  }
  */

  mouseOverShip(payload) {
    const { uiState, currentUser } = this.services;

    const ship = payload.entity.ship;
    const isMine = ship.player.is(currentUser);

    if (isMine && this.clickedShip === ship) {
      return;
    }

    if (!isMine && this.clickedEnemy === ship) {
      return;
    }

    if (this.mouseOveredShip) {
      uiState.hideShipTooltip(this.mouseOveredShip);
    }

    if (isMine && this.clickedShip) {
      uiState.hideShipTooltip(this.clickedShip);
    }

    if (!isMine && this.clickedEnemy) {
      uiState.hideShipTooltip(this.clickedEnemy);
    }

    uiState.showShipTooltip(payload.entity.ship, false, isMine);
    this.mouseOveredShip = payload.entity.ship;
  }

  mouseOutShip(payload) {
    const { shipIconContainer, currentUser } = this.services;

    const ship = payload.entity.ship;
    const isMine = ship.player.is(currentUser);

    if (isMine && this.clickedShip === payload.entity.ship) {
      return;
    }

    if (!isMine && this.clickedEnemy === payload.entity.ship) {
      return;
    }

    const { uiState } = this.services;
    uiState.hideShipTooltip(payload.entity.ship);
    this.mouseOveredShip = null;

    if (isMine && this.clickedShip) {
      uiState.showShipTooltip(this.clickedShip, true, isMine);
    }

    if (!isMine && this.clickedEnemy) {
      uiState.showShipTooltip(this.clickedEnemy, true, isMine);
    }
  }
}

export default MouseOverShowsShipTooltip;
