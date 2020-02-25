import CombatLogTorpedoLaunch from "../../model/combatLog/CombatLogTorpedoLaunch.mjs";

class LaunchHandler {
  advance(gameData) {
    this.launchTorpedos(gameData);
  }

  launchTorpedos(gameData) {
    gameData.ships.getShips().forEach(ship => {
      const torpedoFlights = ship.systems
        .getSystems()
        .reduce(
          (total, system) =>
            total.concat(system.callHandler("launchTorpedo", null, [])),
          []
        );

      torpedoFlights.forEach(flight => {
        const target = gameData.ships.getShipById(flight.targetId);
        const launchPosition = ship.getPosition();
        const targetPosition = target.getPosition();

        const torpedoPosition = launchPosition
          .sub(targetPosition)
          .normalize()
          .multiplyScalar(500)
          .add(targetPosition)
          .roundToHexCenter();

        flight.setStrikePosition(torpedoPosition);
        flight.setLaunchPosition(launchPosition);

        gameData.combatLog.addEntry(new CombatLogTorpedoLaunch(flight.id));
      });

      gameData.torpedos.addTorpedoFlights(torpedoFlights);
    });
  }
}

export default LaunchHandler;
