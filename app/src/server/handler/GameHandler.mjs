import MovementHandler from "./MovementHandler.mjs";
import ElectronicWarfareHandler from "./ElectronicWarfareHandler.mjs";
import WeaponHandler from "./WeaponHandler.mjs";
import PowerHandler from "./PowerHandler.mjs";
import { UnauthorizedError, InvalidGameDataError } from "../errors/index.mjs";
import SystemDataHandler from "./SystemDataHandler.mjs";
import TorpedoHandler from "./TorpedoHandler.mjs";
import LaunchHandler from "./LaunchHandler.mjs";
import CriticalHandler from "./CriticalHandler.mjs";
import HeatHandler from "./HeatHandler.mjs";
import AiHandler from "../ai/AiHandler.mjs";

class GameHandler {
  constructor() {
    this.movementHandler = new MovementHandler();
    this.electronicWarfareHandler = new ElectronicWarfareHandler();
    this.weaponHandler = new WeaponHandler();
    this.powerHandler = new PowerHandler();
    this.systemDataHandler = new SystemDataHandler();
    this.launchHandler = new LaunchHandler();
    this.torpedoHandler = new TorpedoHandler();
    this.criticalHandler = new CriticalHandler();
    this.heatHandler = new HeatHandler();
    this.aiHandler = new AiHandler();
  }

  submit(serverGameData, clientGameData, user) {
    if (!user) {
      throw new UnauthorizedError("Not logged in");
    }

    const activeShips = serverGameData.getActiveShipsForUser(user);

    if (activeShips.length === 0) {
      throw new InvalidGameDataError("Current user has no active ships");
    }

    this.powerHandler.receivePower(
      serverGameData,
      clientGameData,
      activeShips,
      user
    );

    this.systemDataHandler.receiveSystemData(
      serverGameData,
      clientGameData,
      activeShips,
      user
    );

    this.powerHandler.forceValidPower(activeShips);

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

    this.inactivateUsersShips(serverGameData, user);
  }

  inactivateUsersShips(serverGameData, user) {
    serverGameData.getActiveShipsForUser(user).forEach((ship) => {
      serverGameData.setInactiveShip(ship);
    });

    serverGameData.setPlayerInactive(user);
  }

  isReady(gameData) {
    return gameData.getActiveShips().length === 0;
  }

  isHumansReady(gameData) {
    return gameData.getActiveShips().every((ship) => ship.player.isAi());
  }

  processAi(gameData) {
    this.aiHandler.playAiTurn(this, gameData);
  }

  advance(gameData) {
    if (!this.isReady(gameData)) {
      return;
    }

    this.torpedoHandler.advance(gameData);
    this.weaponHandler.advance(gameData);
    this.movementHandler.advance(gameData);
    this.launchHandler.advance(gameData);
    this.electronicWarfareHandler.advance(gameData);
    this.heatHandler.advance(gameData);
    this.criticalHandler.advance(gameData);
    this.powerHandler.advance(gameData);
    this.movementHandler.applyRolls(gameData);

    gameData.endTurn();

    const toSave = gameData.clone();

    gameData.advanceTurn();

    return toSave;
  }
}

export default GameHandler;
