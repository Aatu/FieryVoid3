import GameData from "../game/GameData";
import Ship from "../unit/Ship";
import { SYSTEM_HANDLERS } from "../unit/system/strategy/types/SystemHandlersTypes";
import TorpedoLauncherStrategy from "../unit/system/strategy/weapon/TorpedoLauncherStrategy";
import TorpedoFlight from "../unit/TorpedoFlight";
import { User } from "../User/User";
import FireOrder from "./FireOrder";

class TorpedoAttackService {
  private gameData: GameData | null = null;

  update(gameData: GameData) {
    this.gameData = gameData;
    return this;
  }

  getGameData(): GameData {
    if (!this.gameData) {
      throw new Error("No game data set");
    }
    return this.gameData;
  }

  getPossibleInterceptors(ship: Ship, torpedoFlight: TorpedoFlight) {
    return ship.systems
      .getSystems()
      .filter((system) => !system.isDisabled())
      .filter((system) => system.handlers.canIntercept())
      .filter((weapon) => {
        // only weapons that have arcs facing to the correct direction
        return weapon.callHandler(
          SYSTEM_HANDLERS.isPositionOnArc,
          { targetPosition: torpedoFlight.strikePosition },
          true
        );
      })
      .filter((weapon) => {
        const fireOrders = weapon.callHandler(
          SYSTEM_HANDLERS.getFireOrders,
          null,
          [] as FireOrder[]
        );

        return fireOrders.length === 0;
      });
  }

  getPossibleTorpedosFrom(ship: Ship, target: Ship) {
    let allLaunchers: TorpedoLauncherStrategy[] = [];

    ship.systems.getSystems().forEach((system) => {
      const launchers = system
        .callHandler(
          SYSTEM_HANDLERS.getLoadedLaunchers,
          null,
          [] as TorpedoLauncherStrategy[]
        )
        .filter((launcher) => launcher.canLaunchAgainst({ target }));

      if (launchers.length === 0) {
        return;
      }

      allLaunchers = [...allLaunchers, ...launchers];
    });

    return allLaunchers;
  }

  getPossibleTorpedos(currentUser: User, target: Ship) {
    const torpedoAttackShips: {
      ship: Ship;
      launchers: TorpedoLauncherStrategy[];
      distance: number;
      deltaDistance: number;
    }[] = [];

    if (target.getPlayer().isUsers(currentUser)) {
      return [];
    }

    this.getGameData()
      .ships.getShips()
      .filter((ship) => ship.getPlayer().isUsers(currentUser))
      .forEach((ship) => {
        ship.systems.getSystems().forEach((system) => {
          const launchers = system.callHandler(
            SYSTEM_HANDLERS.getLoadedLaunchers,
            null,
            [] as TorpedoLauncherStrategy[]
          );

          if (launchers.length === 0) {
            return;
          }

          let entry = torpedoAttackShips.find((attack) => attack.ship === ship);

          if (entry) {
            entry.launchers = [...entry.launchers, ...launchers];
          } else {
            torpedoAttackShips.push({
              ship,
              launchers: launchers,
              distance: target
                .getHexPosition()
                .distanceTo(ship.getHexPosition()),
              deltaDistance: getDeltaVelocty(target, ship),
            });
          }
        });
      });

    torpedoAttackShips.sort((a, b) => {
      if (a.distance > b.distance) {
        return 1;
      }

      if (a.distance < b.distance) {
        return -1;
      }

      return 0;
    });

    return torpedoAttackShips;
  }
}

const getDeltaVelocty = (a: Ship, b: Ship) => {
  const distance = a.getHexPosition().distanceTo(b.getHexPosition());
  const aLastMove = a.movement.getLastMove();
  const bLastMove = b.movement.getLastMove();

  if (!aLastMove || !bLastMove) {
    return 0;
  }

  const aPosition = a.getHexPosition().add(aLastMove.getHexVelocity());
  const bPosition = b.getHexPosition().add(bLastMove.getHexVelocity());

  const newDistance = aPosition.distanceTo(bPosition);

  return newDistance - distance;
};

export default TorpedoAttackService;
