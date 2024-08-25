import GameData from "@fieryvoid3/model/src/game/GameData";
import UiStrategy from "./UiStrategy";

class SelectFirstActiveShip extends UiStrategy {
  async update(gameData: GameData) {
    const { uiState, currentUser, gameCamera, shipIconContainer } =
      this.getServices();

    if (!currentUser) {
      return;
    }

    const selectedShip = uiState.getSelectedShip();

    if (selectedShip && gameData.activeShips.isActive(selectedShip)) {
      const oldShip = selectedShip;
      const newShip = gameData.ships.getShipById(oldShip.id);
      if (oldShip !== newShip) {
        uiState.selectShip(newShip);
      }
      return;
    }

    const ship = gameData.getActiveShipsForUser(currentUser).pop();

    if (ship) {
      uiState.selectShip(ship);
      await shipIconContainer.shipsLoaded();
      const icon = shipIconContainer.getByShip(ship);
      gameCamera.setByLookAtPosition(icon.getPosition());
    }
  }
}

export default SelectFirstActiveShip;
