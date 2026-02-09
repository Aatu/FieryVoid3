import GameData, { SerializedGameData } from "../../model/src/game/GameData";
import {
  BuyShipsMessage,
  GAME_MESSAGE,
  GameDataMessage,
  GameMessage,
  LeaveSlotMessage,
  RequestReplayMessage,
  TakeSlotMessage,
} from "../../model/src/game/gameMessage";
import { SerializedShip } from "../../model/src/unit/Ship";
import { User } from "../../model/src/User/User";
import BuyShipsHandler from "../handler/BuyShipsHandler";
import CreateGameHandler from "../handler/CreateGameHandler";
import CreateTestGameHandler from "../handler/CreateTestGameHandler";
import DeploymentHandler from "../handler/DeploymentHandler";
import GameHandler from "../handler/GameHandler";
import ReplayHandler from "../handler/ReplayHandler";
import DbConnection from "../repository/DbConnection";
import GameDataRepository from "../repository/GameDataRepository";
import GameDataService from "../services/GameDataService";
import GameClients from "./GameClients";

class GameController {
  public gameDataService: GameDataService;
  private gameClients: GameClients;
  private createGameHandler: CreateGameHandler;
  private createTestGameHandler: CreateTestGameHandler;
  private buyShipsHandler: BuyShipsHandler;
  private deploymentHandler: DeploymentHandler;
  private gameHandler: GameHandler;
  private replayHandler: ReplayHandler;

  constructor(dbConnection: DbConnection) {
    this.gameDataService = new GameDataService(
      new GameDataRepository(dbConnection)
    );

    this.gameClients = new GameClients();
    this.createGameHandler = new CreateGameHandler();
    this.createTestGameHandler = new CreateTestGameHandler();
    this.buyShipsHandler = new BuyShipsHandler();
    this.deploymentHandler = new DeploymentHandler();
    this.gameHandler = new GameHandler();
    this.replayHandler = new ReplayHandler(this.gameDataService);
  }

  async openConnection(
    connection: WebSocket,
    user: User | undefined,
    gameId: number
  ) {
    if (!user) {
      return;
    }

    this.gameClients.subscribeToGame(connection, user, gameId);
    const gameData = await this.gameDataService.loadGame(gameId);
    if (gameData.turn > 1) {
      const gameDatas = await this.replayHandler.requestReplay(
        gameId,
        gameData.turn - 1,
        gameData.turn
      );

      this.gameClients.sendReplay(gameDatas, user, connection);
    }

    this.gameClients.sendGameData(gameData, user, connection);
  }

  closeConnection(connection: WebSocket, gameId: number) {
    this.gameClients.unSubscribeFromGame(connection, gameId);
  }

  async onMessage(
    message: GameMessage,
    user: User | undefined,
    gameId: number
  ) {
    if (!user) {
      return;
    }

    try {
      switch (message.type) {
        case GAME_MESSAGE.TAKE_SLOT:
          return this.takeSlot(
            gameId,
            (message as TakeSlotMessage).payload,
            user
          );
        case GAME_MESSAGE.LEAVE_SLOT:
          return this.leaveSlot(
            gameId,
            (message as LeaveSlotMessage).payload,
            user
          );
        case GAME_MESSAGE.BUY_SHIPS:
          return this.buyShips(
            gameId,
            (message as BuyShipsMessage).payload.slotId,
            (message as BuyShipsMessage).payload.ships,
            user
          );
        case GAME_MESSAGE.COMMIT_DEPLOYMENT:
          return this.commitDeployment(
            gameId,
            (message as GameDataMessage).payload,
            user
          );
        case GAME_MESSAGE.COMMIT_TURN:
          return this.commitTurn(
            gameId,
            (message as GameDataMessage).payload,
            user
          );
        case GAME_MESSAGE.REQUEST_REPLAY:
          return this.requestReplay(
            gameId,
            (message as RequestReplayMessage).payload,
            user
          );
        default:
          throw new Error(`Unrecognized message type ${message.type}`);
      }
    } catch (error) {
      console.log("onMessage error:");
      console.log(error);
      throw error;
    }
  }

  async requestReplay(
    gameId: number,
    { start = 1, end = null }: { start: number; end: number | null },
    user: User
  ) {
    const gameDatas = await this.replayHandler.requestReplay(
      gameId,
      start,
      end
    );

    this.gameClients.sendReplay(gameDatas, user);
  }

  async createGame(clientGameData: SerializedGameData, user: User) {
    const game = new GameData(clientGameData);
    const serverGameData = this.createGameHandler.createGame(game, user);

    const gameId = await this.gameDataService.createGame(serverGameData);
    return gameId;
  }

  async createTestGame(requestBody: { useAI: boolean }, user: User) {
    if (!user) {
      return;
    }

    const serverGameData =
      this.createTestGameHandler.createTestGame(requestBody);
    const gameId = await this.gameDataService.createGame(serverGameData);
    const { key, gameData } = await this.gameDataService.reserveGame(gameId);
    this.createTestGameHandler.createTestShips(gameData, requestBody);
    await this.gameDataService.saveGame(key, gameData);

    return gameId;
  }

  async removeGame(gameId: number, user: User) {
    const { key, gameData } = await this.gameDataService.reserveGame(gameId);
    this.createGameHandler.removeGame(gameData, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(key, gameData);
  }

  async getGameData(gameId: number, user: User | null = null) {
    const game = await this.gameDataService.loadGame(gameId);
    return game.censorForUser(user);
  }

  async takeSlot(gameId: number, slotId: string, user: User) {
    const { key, gameData } = await this.gameDataService.reserveGame(gameId);
    this.createGameHandler.takeSlot(gameData, slotId, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(key, gameData);
  }

  async leaveSlot(gameId: number, slotId: string, user: User) {
    const { key, gameData } = await this.gameDataService.reserveGame(gameId);
    this.createGameHandler.leaveSlot(gameData, slotId, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(key, gameData);
  }

  async buyShips(
    gameId: number,
    slotId: string,
    ships: SerializedShip[],
    user: User
  ) {
    const { key, gameData } = await this.gameDataService.reserveGame(gameId);
    this.buyShipsHandler.buyShips(gameData, slotId, ships, user);
    this.gameClients.sendGameDataAll(gameData);
    await this.gameDataService.saveGame(key, gameData);
  }

  async commitDeployment(
    gameId: number,
    clientGameData: SerializedGameData,
    user: User
  ) {
    const gameData = new GameData(clientGameData);
    const { key, gameData: serverGameData } =
      await this.gameDataService.reserveGame(gameId);

    this.deploymentHandler.deploy(serverGameData, gameData, user);

    this.gameClients.sendGameDataAll(serverGameData);
    await this.gameDataService.saveGame(key, serverGameData);
  }

  async commitTurn(
    gameId: number,
    clientGameData: SerializedGameData,
    user: User
  ) {
    const gameData = new GameData(clientGameData);
    const { key, gameData: serverGameData } =
      await this.gameDataService.reserveGame(gameId);

    try {
      const toSave: GameData[] = [];
      const toSend: GameData[] = [];

      this.gameHandler.submit(serverGameData, gameData, user);

      if (this.gameHandler.isHumansReady(serverGameData)) {
        this.gameHandler.processAi(serverGameData);
      }

      toSave.push(serverGameData.clone());

      if (this.gameHandler.isReady(serverGameData)) {
        const advanced = this.gameHandler.advance(serverGameData);
        if (advanced) {
          toSave.push(advanced);
        }
        toSave.push(serverGameData);

        await this.gameDataService.saveGame(key, toSave);

        const turn = serverGameData.turn;
        const replays = await this.replayHandler.requestReplay(
          gameId,
          turn - 1,
          turn
        );

        this.gameClients.sendTurnChange(replays);
      } else {
        toSend.push(serverGameData.clone());
        await this.gameDataService.saveGame(key, toSave);
      }

      return toSend;
    } catch (e) {
      this.gameDataService.releaseGame(key, gameId);
      throw e;
    }
  }
}

export default GameController;
