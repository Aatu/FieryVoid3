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

  sendGameDataAll(gameData) {
    if (!this.games[gameData.id]) {
      return;
    }

    this.games[gameData.id].forEach(subscription =>
      this.sendGameData(gameData, null, subscription.connection)
    );
  }

  sendGameData(gameData, user = null, connection = null) {
    if (!gameData) {
      return;
    }

    if (!user && !connection) {
      throw new Error("Either connection or user must be given");
    }

    if (!connection && user) {
      const game = this.games[gameData.id].find(
        subscription => subscription.user.id === user.id
      );
      if (game.connection) {
        connection = game.connection;
      }
    }

    if (connection) {
      connection.send(
        JSON.stringify({
          type: "gameData",
          payload: gameData.serialize()
        })
      );
    }
  }
}

export default GameClients;
