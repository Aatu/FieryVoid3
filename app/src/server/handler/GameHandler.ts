import ElectronicWarfareHandler from "./ElectronicWarfareHandler";
import PowerHandler from "./PowerHandler";
import { UnauthorizedError, InvalidGameDataError } from "../errors/index";
import SystemDataHandler from "./SystemDataHandler";
import TorpedoHandler from "./TorpedoHandler";
import LaunchHandler from "./LaunchHandler";
import CriticalHandler from "./CriticalHandler";
import HeatHandler from "./HeatHandler";
import MovementHandler from "./MovementHandler";
import WeaponHandler from "./WeaponHandler";
import AiHandler from "../ai/AiHandler";
import GameData from "../../model/src/game/GameData";
import { User } from "../../model/src/User/User";

class GameHandler {
  private movementHandler: MovementHandler;
  private electronicWarfareHandler: ElectronicWarfareHandler;
  private weaponHandler: WeaponHandler;
  private powerHandler: PowerHandler;
  private systemDataHandler: SystemDataHandler;
  private launchHandler: LaunchHandler;
  private torpedoHandler: TorpedoHandler;
  private criticalHandler: CriticalHandler;
  private heatHandler: HeatHandler;
  private aiHandler: AiHandler;

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

  submit(serverGameData: GameData, clientGameData: GameData, user: User) {
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

  inactivateUsersShips(serverGameData: GameData, user: User) {
    serverGameData.getActiveShipsForUser(user).forEach((ship) => {
      serverGameData.setInactiveShip(ship);
    });

    serverGameData.setPlayerInactive(user);
  }

  isReady(gameData: GameData) {
    return gameData.getActiveShips().length === 0;
  }

  isHumansReady(gameData: GameData) {
    return gameData.getActiveShips().every((ship) => ship.getPlayer().isAi());
  }

  processAi(gameData: GameData) {
    this.aiHandler.playAiTurn(this, gameData);
  }

  advance(gameData: GameData) {
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
