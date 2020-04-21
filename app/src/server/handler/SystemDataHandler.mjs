class SystemDataHandler {
  receiveSystemData(serverGameData, clientGameData, activeShips, user) {
    activeShips.forEach((serverShip) => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      let count = serverShip.getRequiredPhasesForReceivingPlayerData();

      for (let phase = count; phase > 0; phase--) {
        serverShip.receivePlayerData(clientShip, serverGameData, phase);
      }
    });
  }

  advance(gameData) {}
}

export default SystemDataHandler;
