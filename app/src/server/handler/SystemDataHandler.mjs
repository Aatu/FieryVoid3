class SystemDataHandler {
  receiveSystemData(serverGameData, clientGameData, activeShips, user) {
    activeShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      serverShip.receivePlayerData(clientShip, serverGameData);
    });
  }

  advance(gameData) {}
}

export default SystemDataHandler;
