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

  advance(gameData) {
    if (gameData.getActiveShips().length !== 0) {
      return false;
    }

    gameData.players.forEach(player => gameData.setPlayerActive(player));
    gameData.ships.getShips().forEach(ship => gameData.setActiveShip(ship));
    gameData.advanceTurn();

    return true;
  }
}

export default GameHandler;
