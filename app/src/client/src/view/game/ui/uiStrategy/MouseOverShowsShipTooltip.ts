import Ship from "@fieryvoid3/model/src/unit/Ship";
import UiStrategy from "./UiStrategy";
import ShipObject from "../../renderer/ships/ShipObject";

class MouseOverShowsShipTooltip extends UiStrategy {
  private clickedShip: Ship | null = null;
  private clickedEnemy: Ship | null = null;
  private mouseOveredShip: Ship | null = null;

  shipTooltipClosed(ship: Ship) {
    if (this.clickedShip === ship) {
      this.clickedShip = null;
    }

    if (this.clickedEnemy === ship) {
      this.clickedEnemy = null;
    }
  }

  shipStateChanged(ship: Ship) {
    const { uiState, currentUser } = this.getServices();

    const isMine = ship.player.is(currentUser);

    if (this.clickedShip === ship) {
      uiState.showShipTooltip(ship, true, isMine);
    }
    if (this.clickedEnemy === ship) {
      uiState.showShipTooltip(ship, true, isMine);
    }
  }

  deactivate() {
    const { uiState } = this.getServices();
    if (this.clickedShip) {
      uiState.hideShipTooltip(this.clickedShip);
    }

    if (this.clickedEnemy) {
      uiState.hideShipTooltip(this.clickedEnemy);
    }
  }

  shipClicked(payload: { entity: ShipObject }) {
    const { uiState, currentUser } = this.getServices();

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
    const { uiState } = this.getServices();

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

  mouseOverShip(payload: { entity: ShipObject }) {
    const { uiState, currentUser } = this.getServices();

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

  mouseOutShip(payload: { entity: ShipObject }) {
    const { currentUser } = this.getServices();

    const ship = payload.entity.ship;
    const isMine = ship.player.is(currentUser);

    if (isMine && this.clickedShip === payload.entity.ship) {
      return;
    }

    if (!isMine && this.clickedEnemy === payload.entity.ship) {
      return;
    }

    const { uiState } = this.getServices();
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
