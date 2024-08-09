import CombatLogTorpedoLaunch from "../../model/src/combatLog/CombatLogTorpedoLaunch";
import GameData from "../../model/src/game/GameData";
import { SYSTEM_HANDLERS } from "../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import Torpedo from "../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo";
import TorpedoFlight from "../../model/src/unit/TorpedoFlight";

class LaunchHandler {
  advance(gameData: GameData) {
    this.launchTorpedos(gameData);
  }

  launchTorpedos(gameData: GameData) {
    gameData.ships.getShips().forEach((ship) => {
      const torpedoFlights = ship.systems
        .getSystems()
        .reduce(
          (total, system) =>
            total.concat(
              system.callHandler(
                SYSTEM_HANDLERS.launchTorpedo,
                null,
                [] as TorpedoFlight[]
              )
            ),
          [] as TorpedoFlight[]
        );

      torpedoFlights.forEach((flight) => {
        const target = gameData.ships.getShipById(flight.getTargetId());
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
