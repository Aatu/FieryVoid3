import { SERVER_WEBSOCKET_URL } from "../../config";
import GameData from "../../../model/game/GameData.mjs";

class GameConnector {
  constructor(gameId) {
    this.gameId = gameId;
    this.phaseDirector = null;
    this.webSocket = null;
    this.open = false;
    this.connection = null;
    this.connectionResolve = null;
  }

  init(phaseDirector) {
    this.phaseDirector = phaseDirector;
  }

  connect(timeout = 0) {
    this.connection = new Promise(resolve => {
      setTimeout(() => {
        this.webSocket = new WebSocket(SERVER_WEBSOCKET_URL + this.gameId);
        this.connectionResolve = resolve;
        this.webSocket.onerror = this.onError.bind(this);
        this.webSocket.onmessage = this.onMessage.bind(this);
        this.webSocket.onclose = this.onClose.bind(this);
        this.webSocket.onopen = this.onOpen.bind(this);
      }, timeout);
    });
  }

  async disconnect() {
    this.open = false;
    (await this.connection).close();
  }

  onOpen() {
    this.open = true;
    this.connectionResolve(this.webSocket);
  }

  onError() {
    console.log("error");
    console.log(arguments);
  }

  onClose() {
    if (this.open) {
      this.connect(2000);
    }
  }

  onMessage({ data }) {
    const { type, payload } = JSON.parse(data);

    switch (type) {
      case "gameData":
        this.phaseDirector.receiveGameData(new GameData(payload));
        break;
      default:
        throw new Error(`Unrecognized websocket message type: '${type}'`);
    }
  }
}

export default GameConnector;
