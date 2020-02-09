class PowerHandler {
  receivePower(serverGameData, clientGameData, activeShips, user) {
    activeShips.forEach(serverShip => {
      const clientShip = clientGameData.ships.getShipById(serverShip.id);
      serverShip.systems.power.copyPower(clientShip);
    });
  }

  forceValidPower(activeShips) {
    activeShips.forEach(serverShip => {
      if (!serverShip.systems.power.isValidPower()) {
        console.log("forcing valid power for " + serverShip.id);
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
