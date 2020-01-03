class PowerHandler {
  receivePower(serverGameData, clientGameData, activeShips, user) {
    activeShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      serverShip.systems.power.copyPower(clientShip);

      if (!serverShip.systems.power.isValidPower()) {
        serverShip.systems.power.forceValidPower();
      }
    });
  }

  advance(gameData) {
    gameData.ships.getShips().forEach(ship => {
      ship.systems
        .getSystems()
        .filter(system => system.callHandler("shouldBeOffline", null, false))
        .forEach(system => system.power.forceOffline());
    });
  }
}

export default PowerHandler;
