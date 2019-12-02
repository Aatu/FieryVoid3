class TorpedoAttackService {
  constructor(services, gameData, target) {
    this.services = services;
    this.target = target;
    this.gameData = gameData;
  }

  getPossibleTorpedos(currentUser) {
    const torpedoAttackShips = [];

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
