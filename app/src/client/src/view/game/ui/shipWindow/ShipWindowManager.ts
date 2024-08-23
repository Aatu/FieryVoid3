import { MovementService } from "@fieryvoid3/model/src/movement";
import UIState from "../UIState";
import Ship from "@fieryvoid3/model/src/unit/Ship";

class ShipWindowManager {
  private uiState: UIState;
  private movementService: MovementService;
  private ships: Ship[];
  constructor(uiState: UIState, movementService: MovementService) {
    this.uiState = uiState;
    this.movementService = movementService;
    this.ships = [];
  }

  /*
  open(ship: Ship) {
    this.ships = this.ships.filter(function (otherShip) {
      return otherShip.player.user !== ship.player.user;
    });

    if (!this.ships.includes(ship)) {
      this.ships.push(ship);
    }

    this.uiState.setShipWindows({
      ships: this.ships,
      movementService: this.movementService,
    });
  }

  close(ship) {
    this.ships = this.ships.filter(function (openShip) {
      return openShip !== ship;
    });

    this.uiState.setShipWindows({
      ships: this.ships,
      movementService: this.movementService,
    });
  }

  closeAll() {
    this.ships = [];

    this.uiState.setShipWindows({
      ships: this.ships,
      movementService: this.movementService,
    });
  }

  update() {
    this.uiState.setShipWindows({
      ships: this.ships,
      movementService: this.movementService,
    });
  }
    */
}

export default ShipWindowManager;
