class SystemDataHandler {
  receiveSystemData(serverGameData, clientGameData, activeShips, user) {
    activeShips.forEach((serverShip) => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      let count = serverShip.getRequiredPhasesForReceivingPlayerData();

      for (let phase = 1; phase <= count; phase++) {
        serverShip.receivePlayerData(clientShip, serverGameData, phase);
      }
    });
  }

  advance(gameData) {}
}

export default SystemDataHandler;
