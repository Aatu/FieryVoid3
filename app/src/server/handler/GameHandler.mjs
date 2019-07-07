import MovementHandler from "./MovementHandler.mjs";

class GameHandler {
  constructor() {
    this.movementHandler = new MovementHandler();
  }

  submit(serverGameData, clientGameData, user) {
    this.movementHandler.receiveMoves(serverGameData, clientGameData, user);
    this.inactivateUsersShips(serverGameData, user);
  }

  inactivateUsersShips(serverGameData, user) {
    serverGameData.getActiveShipsForUser(user).forEach(ship => {
      serverGameData.setInactiveShip(ship);
    });

    serverGameData.setPlayerInactive(user);
  }

  isReady(gameData) {
    return gameData.getActiveShips().length === 0;
  }

  advance(gameData) {
    if (!this.isReady(gameData)) {
      return;
    }

    gameData.players.forEach(player => gameData.setPlayerActive(player));
    gameData.ships.getShips().forEach(ship => gameData.setActiveShip(ship));
    gameData.advanceTurn();
    gameData.removeOldData();

    return;
  }
}

export default GameHandler;
