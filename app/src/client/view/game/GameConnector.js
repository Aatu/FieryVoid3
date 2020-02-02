import { SERVER_WEBSOCKET_URL } from "../../config";
import GameData from "../../../model/game/GameData.mjs";
import * as gameMessages from "../../../model/game/gameMessage";

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

  async deactivate() {
    const connection = await this.connection;
    connection.close();
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

  async commitTurn(gameData) {
    const connection = await this.connection;
    connection.send(
      JSON.stringify({
        type: gameMessages.MESSAGE_COMMIT_TURN,
        payload: gameData.serialize()
      })
    );
  }

  async commitDeployment(gameData) {
    const connection = await this.connection;
    connection.send(
      JSON.stringify({
        type: gameMessages.MESSAGE_COMMIT_DEPLOYMENT,
        payload: gameData.serialize()
      })
    );
  }

  async takeSlot(slotId) {
    const connection = await this.connection;
    connection.send(
      JSON.stringify({
        type: gameMessages.MESSAGE_TAKE_SLOT,
        payload: slotId
      })
    );
  }

  async leaveSlot(slotId) {
    const connection = await this.connection;
    connection.send(
      JSON.stringify({
        type: gameMessages.MESSAGE_LEAVE_SLOT,
        payload: slotId
      })
    );
  }

  async buyShips(slotId, ships) {
    const connection = await this.connection;
    connection.send(
      JSON.stringify({
        type: gameMessages.MESSAGE_BUY_SHIPS,
        payload: {
          slotId,
          ships: ships.map(ship => ship.serialize())
        }
      })
    );
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
    console.log("message received", type);

    switch (type) {
      case gameMessages.MESSAGE_GAMEDATA:
        this.phaseDirector.receiveGameData(new GameData(payload));
        break;

      case gameMessages.MESSAGE_TURN_CHANGED:
        this.phaseDirector.receiveTurnChange(
          payload.map(entry => new GameData(entry))
        );
        break;

      case gameMessages.MESSAGE_REPLAY:
        this.phaseDirector.receiveReplay(
          payload.map(entry => new GameData(entry))
        );
        break;
      default:
        throw new Error(`Unrecognized websocket message type: '${type}'`);
    }
  }
}

export default GameConnector;
