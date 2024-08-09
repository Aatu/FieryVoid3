import GameData from "../../model/src/game/GameData";
import { User } from "../../model/src/User/User";
import { GAME_MESSAGE } from "../../model/src/game/gameMessage";

class GameClients {
  private games: Record<string, { connection: WebSocket; user: User }[]>;

  constructor() {
    this.games = {};
  }

  subscribeToGame(connection: WebSocket, user: User, gameId: number) {
    if (!this.games[gameId]) {
      this.games[gameId] = [{ connection, user }];
    } else {
      this.games[gameId].push({ connection, user });
    }
  }

  unSubscribeFromGame(connection: WebSocket, gameId: number) {
    if (!this.games[gameId]) {
      return;
    }

    this.games[gameId] = this.games[gameId].filter(
      (subscription) => subscription.connection !== connection
    );
  }

  getClientsForGame(gameId: number) {
    if (!this.games[gameId]) {
      return [];
    }

    return this.games[gameId];
  }

  sendReplay(
    gameDatas: GameData | GameData[],
    user: User,
    connection?: WebSocket
  ) {
    gameDatas = ([] as GameData[]).concat(gameDatas);
    this.sendGameData(gameDatas, user, connection, GAME_MESSAGE.REPLAY);
  }

  sendTurnChange(gameDatas: GameData | GameData[]) {
    return this.sendGameDataAll(gameDatas, GAME_MESSAGE.TURN_CHANGED);
  }

  sendGameDataAll(
    gameDatas: GameData | GameData[],
    message = GAME_MESSAGE.GAMEDATA
  ) {
    gameDatas = ([] as GameData[]).concat(gameDatas);
    const gameId = gameDatas[0].getId();

    if (!this.games[gameId]) {
      return;
    }

    this.games[gameId].forEach((subscription) =>
      this.sendGameData(
        gameDatas,
        subscription.user,
        subscription.connection,
        message
      )
    );
  }

  sendGameData(
    gameDatas: GameData | GameData[],
    user: User | null = null,
    connection: WebSocket | null = null,
    message = GAME_MESSAGE.GAMEDATA
  ) {
    if (!gameDatas) {
      return;
    }

    if (!user && !connection) {
      throw new Error("Either connection or user must be given");
    }

    gameDatas = ([] as GameData[]).concat(gameDatas);
    const gameId = gameDatas[0].getId();

    if (!connection && user) {
      const game = this.games[gameId].find(
        (subscription) => subscription.user.id === user.id
      );
      if (game!.connection) {
        connection = game!.connection;
      }
    }

    if (connection) {
      connection.send(
        JSON.stringify({
          type: message,
          payload: this.getMessage(gameDatas, message, user),
        })
      );
    }
  }

  getMessage(payload: GameData[], message: GAME_MESSAGE, user: User | null) {
    switch (message) {
      case GAME_MESSAGE.GAMEDATA:
        return payload[payload.length - 1]
          .clone()
          .censorForUser(user)
          .serialize();
      case GAME_MESSAGE.REPLAY:
      case GAME_MESSAGE.TURN_CHANGED:
        payload[payload.length - 1].clone().censorForUser(user);
        return payload.map((gameData) => gameData.clone().serialize());
    }
  }
}

export default GameClients;
