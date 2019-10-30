import MovementHandler from "./MovementHandler.mjs";
import ElectronicWarfareHandler from "./ElectronicWarfareHandler.mjs";
import WeaponHandler from "./WeaponHandler.mjs";
import PowerHandler from "./PowerHandler.mjs";
import { UnauthorizedError, InvalidGameDataError } from "../errors/index.mjs";

class GameHandler {
  constructor() {
    this.movementHandler = new MovementHandler();
    this.electronicWarfareHandler = new ElectronicWarfareHandler();
    this.weaponHandler = new WeaponHandler();
    this.powerHandler = new PowerHandler();
  }

  submit(serverGameData, clientGameData, user) {
    if (!user) {
      throw new UnauthorizedError("Not logged in");
    }

    const activeShips = serverGameData.getActiveShipsForUser(user);

    if (activeShips.length === 0) {
      throw new InvalidGameDataError("Current user has no active ships");
    }

    this.movementHandler.receiveMoves(
      serverGameData,
      clientGameData,
      activeShips,
      user
    );

    this.electronicWarfareHandler.receiveElectronicWarfare(
      serverGameData,
      clientGameData,
      activeShips,
      user
    );

    this.weaponHandler.receiveFireOrders(
      serverGameData,
      clientGameData,
      activeShips,
      user
    );

    this.powerHandler.receivePower(
      serverGameData,
      clientGameData,
      activeShips,
      user
    );

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

    this.movementHandler.advance(gameData);
    this.electronicWarfareHandler.advance(gameData);
    this.weaponHandler.advance(gameData);
    this.powerHandler.advance(gameData);

    const toSave = gameData.clone();

    gameData.advanceTurn();

    return toSave;
  }
}

export default GameHandler;
