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

  sendGameData(user, gameData) {
    if (!gameData) {
      return;
    }

    const { connection = null } = this.games[gameData.id].find(
      subscription => subscription.user.id === user.id
    );

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
