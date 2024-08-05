class TorpedoAttackService {
  update(gameData) {
    this.gameData = gameData;
    return this;
  }

  getPossibleInterceptors(ship, torpedoFlight) {
    return ship.systems
      .getSystems()
      .filter(system => !system.isDisabled())
      .filter(system => system.callHandler("canIntercept"))
      .filter(weapon => {
        // only weapons that have arcs facing to the correct direction
        return weapon.callHandler(
          "isPositionOnArc",
          { targetPosition: torpedoFlight.strikePosition },
          true
        );
      })
      .filter(weapon => {
        const fireOrders = weapon.callHandler("getFireOrders", null, []);

        return fireOrders.length === 0;
      });
  }

  getPossibleTorpedosFrom(ship, target) {
    let allLaunchers = [];

    ship.systems.getSystems().forEach(system => {
      const launchers = system
        .callHandler("getLoadedLaunchers", null, [])
        .filter(launcher => launcher.canLaunchAgainst({ target }));

      if (launchers.length === 0) {
        return;
      }

      allLaunchers = [...allLaunchers, ...launchers];
    });

    return allLaunchers;
  }

  getPossibleTorpedos(currentUser, target) {
    const torpedoAttackShips = [];

    if (target.player.isUsers(currentUser)) {
      return [];
    }

    this.gameData.ships
      .getShips()
      .filter(ship => ship.player.isUsers(currentUser))
      .forEach(ship => {
        ship.systems.getSystems().forEach(system => {
          const launchers = system.callHandler("getLoadedLaunchers", null, []);

          if (launchers.length === 0) {
            return;
          }

          let entry = torpedoAttackShips.find(attack => attack.ship === ship);

          if (entry) {
            entry.launchers = [...entry.launchers, ...launchers];
          } else {
            torpedoAttackShips.push({
              ship,
              launchers: launchers,
              distance: this.target
                .getHexPosition()
                .distanceTo(ship.getHexPosition()),
              deltaDistance: getDeltaVelocty(this.target, ship)
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

const getDeltaVelocty = (a, b) => {
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
