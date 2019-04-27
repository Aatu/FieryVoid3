class ShipWindowManager {
  constructor(uiState, movementService) {
    this.uiState = uiState;
    this.movementService = movementService;
    this.ships = [];
  }

  open(ship) {
    this.ships = this.ships.filter(function(otherShip) {
      return otherShip.player.user !== ship.player.user;
    });

    if (!this.ships.includes(ship)) {
      this.ships.push(ship);
    }

    this.uiState.setShipWindows({
      ships: this.ships,
      movementService: this.movementService
    });
  }

  close(ship) {
    this.ships = this.ships.filter(function(openShip) {
      return openShip !== ship;
    });

    this.uiState.setShipWindows({
      ships: this.ships,
      movementService: this.movementService
    });
  }

  closeAll() {
    this.ships = [];

    this.uiState.setShipWindows({
      ships: this.ships,
      movementService: this.movementService
    });
  }

  update() {
    this.uiState.setShipWindows({
      ships: this.ships,
      movementService: this.movementService
    });
  }
}

export default ShipWindowManager;
