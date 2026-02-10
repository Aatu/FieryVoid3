import {
  getPromise,
  ReadyPromise,
} from "@fieryvoid3/model/src/utils/ReadyPromise";
import { SERVER_WEBSOCKET_URL } from "../../config";
import PhaseDirector from "./phase/PhaseDirector";
import GameData from "@fieryvoid3/model/src/game/GameData";
import {
  GAME_MESSAGE,
  GameDataMessage,
  TurnDataMessage,
  ReplayMessage,
} from "@fieryvoid3/model/src/game/gameMessage";
import Ship from "@fieryvoid3/model/src/unit/Ship";

class GameConnector {
  private gameId: number;
  private phaseDirector: PhaseDirector | null;
  private webSocket: WebSocket | null;
  private open: boolean;
  private connection: ReadyPromise<WebSocket>;

  constructor(gameId: number) {
    this.gameId = gameId;
    this.phaseDirector = null;
    this.webSocket = null;
    this.open = false;
    this.connection = getPromise<WebSocket>();
  }

  init(phaseDirector: PhaseDirector) {
    this.phaseDirector = phaseDirector;
  }

  async getConnection() {}

  async deactivate() {
    (await this.connection.promise).close();
  }

  connect(timeout = 0) {
    setTimeout(() => {
      this.webSocket = new WebSocket(SERVER_WEBSOCKET_URL + this.gameId);

      this.webSocket.onerror = this.onError.bind(this);
      this.webSocket.onmessage = this.onMessage.bind(this);
      this.webSocket.onclose = this.onClose.bind(this);
      this.webSocket.onopen = this.onOpen.bind(this);
    }, timeout);
  }

  async commitTurn(gameData: GameData) {
    (await this.connection.promise).send(
      JSON.stringify({
        type: GAME_MESSAGE.COMMIT_TURN,
        payload: gameData.serialize(),
      })
    );
  }

  async commitDeployment(gameData: GameData) {
    (await this.connection.promise).send(
      JSON.stringify({
        type: GAME_MESSAGE.COMMIT_DEPLOYMENT,
        payload: gameData.serialize(),
      })
    );
  }

  async takeSlot(slotId: string) {
    (await this.connection.promise).send(
      JSON.stringify({
        type: GAME_MESSAGE.TAKE_SLOT,
        payload: slotId,
      })
    );
  }

  async leaveSlot(slotId: string) {
    (await this.connection.promise).send(
      JSON.stringify({
        type: GAME_MESSAGE.LEAVE_SLOT,
        payload: slotId,
      })
    );
  }

  async buyShips(slotId: string, ships: Ship[]) {
    (await this.connection.promise).send(
      JSON.stringify({
        type: GAME_MESSAGE.BUY_SHIPS,
        payload: {
          slotId,
          ships: ships.map((ship) => ship.serialize()),
        },
      })
    );
  }

  async disconnect() {
    this.open = false;

    (await this.connection.promise).close();
  }

  onOpen() {
    this.open = true;
    this.connection.resolve(this.webSocket!);
  }

  onError(error: unknown) {
    console.log("error", error);
  }

  onClose() {
    if (this.open) {
      this.connect(2000);
    }
  }

  private getPhaseDirector() {
    if (!this.phaseDirector) {
      throw new Error("Phase director not initialized");
    }
    return this.phaseDirector;
  }

  onMessage({ data }: { data: string }) {
    const message = JSON.parse(data);
    console.log("message received", message.type);

    switch (message.type) {
      case GAME_MESSAGE.GAMEDATA:
        this.getPhaseDirector().receiveGameData(
          new GameData((message as GameDataMessage).payload)
        );
        break;

      case GAME_MESSAGE.TURN_CHANGED:
        this.getPhaseDirector().receiveTurnChange(
          (message as TurnDataMessage).payload.map(
            (entry) => new GameData(entry)
          )
        );
        break;

      case GAME_MESSAGE.REPLAY:
        this.getPhaseDirector().receiveReplay(
          (message as ReplayMessage).payload.map((entry) => new GameData(entry))
        );
        break;
      default:
        throw new Error(
          `Unrecognized websocket message type: '${message.type}'`
        );
    }
  }
}

export default GameConnector;
