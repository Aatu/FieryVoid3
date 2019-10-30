class PowerHandler {
  receivePower(serverGameData, clientGameData, activeShips, user) {
    activeShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      serverShip.systems.power.copyPower(clientShip);
    });
  }

  advance(gameData) {
    gameData.ships.getShips().forEach(ship => {
      if (!ship.systems.power.isValidPower()) {
        ship.systems.power.forceValidPower();
      }
    });
  }
}

export default PowerHandler;
