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
        flight.setPosition(ship.getPosition());
        flight.setLaunchPosition(ship.getPosition());
        flight.setVelocity(ship.getVelocity());

        gameData.combatLog.addEntry(new CombatLogTorpedoLaunch(flight.id));
      });

      gameData.torpedos.addTorpedoFlights(torpedoFlights);
    });
  }
}

export default LaunchHandler;
