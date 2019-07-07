import * as gameMessages from "../../model/game/gameMessage.mjs";

class GameClients {
  constructor() {
    this.games = {};
  }

  subscribeToGame(connection, user, gameId) {
    if (!this.games[gameId]) {
      this.games[gameId] = [{ connection, user }];
    } else {
      this.games[gameId].push({ connection, user });
    }
  }

  unSubscribeFromGame(connection, gameId) {
    if (!this.games[gameId]) {
      return;
    }

    this.games[gameId] = this.games[gameId].filter(
      subscription => subscription.connection !== connection
    );
  }

  getClientsForGame(gameId) {
    if (!this.games[gameId]) {
      return [];
    }

    return this.games[gameId];
  }

  sendReplay(gameDatas, user, connection) {
    gameDatas = [].concat(gameDatas);
    this.sendGameData(gameDatas, user, connection, gameMessages.MESSAGE_REPLAY);
  }

  sendTurnChange(gameDatas) {
    return this.sendGameDataAll(gameDatas, gameMessages.MESSAGE_TURN_CHANGED);
  }

  sendGameDataAll(gameDatas, message = gameMessages.MESSAGE_GAMEDATA) {
    gameDatas = [].concat(gameDatas);
    const gameId = gameDatas[0].id;

    if (!this.games[gameId]) {
      return;
    }

    this.games[gameId].forEach(subscription =>
      this.sendGameData(
        gameDatas,
        subscription.user,
        subscription.connection,
        message
      )
    );
  }

  sendGameData(
    gameDatas,
    user = null,
    connection = null,
    message = gameMessages.MESSAGE_GAMEDATA
  ) {
    if (!gameDatas) {
      return;
    }

    if (!user && !connection) {
      throw new Error("Either connection or user must be given");
    }

    gameDatas = [].concat(gameDatas);
    const gameId = gameDatas[0].id;

    if (!connection && user) {
      const game = this.games[gameId].find(
        subscription => subscription.user.id === user.id
      );
      if (game.connection) {
        connection = game.connection;
      }
    }

    if (connection) {
      connection.send(
        JSON.stringify({
          type: message,
          payload: this.getMessage(gameDatas, message, user)
        })
      );
    }
  }

  getMessage(payload, message, user) {
    switch (message) {
      case gameMessages.MESSAGE_GAMEDATA:
        return payload[payload.length - 1]
          .clone()
          .censorForUser(user)
          .serialize();
      case gameMessages.MESSAGE_REPLAY:
      case gameMessages.MESSAGE_TURN_CHANGED:
        payload[payload.length - 1].clone().censorForUser(user);
        return payload.map(gameData => gameData.clone().serialize());
    }
  }
}

export default GameClients;
