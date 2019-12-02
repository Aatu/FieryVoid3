import HexagonMath from "../../model/utils/HexagonMath.mjs";
import Vector from "../../model/utils/Vector.mjs";
import { shuffleArray } from "../../model/utils/math.mjs";

class TorpedoHandler {
  advance(gameData) {
    this.moveTorpedos(gameData);
    this.interceptTorpedos(gameData);
    this.impactTorpedos(gameData);
  }

  chooseInterceptor(gameData, flight, usedWeapons) {
    const target = gameData.ships.getShipById(flight.targetId);
    const interceptor = gameData
      .getShips()
      .filter(
        ship =>
          gameData.slots.getTeamForShip(ship) ===
          gameData.slots.getTeamForShip(target)
      )
      .reduce((all, ship) => {
        //get weapons capable of intercepting
        return [
          ...all,
          ...ship.systems
            .getSystems()
            .filter(system => !system.wasDisabled())
            .filter(system => system.callHandler("canIntercept"))
        ];
      }, [])
      .filter(weapon => {
        // only weapons that have arcs facing to the correct direction
        const torpedoPosition = flight.position.sub(flight.velocity);
        return weapon.callHandler(
          "isPositionOnArc",
          { targetPosition: torpedoPosition },
          true
        );
      })
      .filter(weapon => {
        //disregard weapons that have fire order with result. Those without a result did not fire;
        const fireOrders = weapon.callHandler("getFireOrders", null, []);

        if (fireOrders.length === 0) {
          return true;
        }

        return fireOrders.every(fireOrder => !fireOrder.result);
      })
      .filter(weapon => {
        //get weapons that still have uses
        const numberOfIntercepts = weapon.callHandler(
          "getNumberOfIntercepts",
          null,
          0
        );

        const used = usedWeapons.reduce((total, usedWeapon) =>
          usedWeapon === weapon ? total + 1 : total
        );

        return numberOfIntercepts > used;
      })
      .sort((a, b) => {
        const changeA = a.callHandler(
          "getInterceptChance",
          { target, torpedoFlight: flight },
          0
        );
        const changeB = b.callHandler(
          "getInterceptChance",
          { target, torpedoFlight: flight },
          0
        );

        if (changeA > changeB) {
          return 1;
        }

        if (changeA < changeB) {
          return -1;
        }

        return 0;
      })
      .pop();

    return interceptor;
  }

  interceptTorpedos(gameData) {
    const impactingTorpedos = gameData.torpedos
      .getTorpedoFlights()
      .filter(flight => flight.reachedTarget);

    let interceptTry = 3;

    while (interceptTry--) {
      const usedWeapons = [];

      impactingTorpedos
        .filter(flight => flight.getInterceptTries() >= interceptTry)
        .forEach(flight => {
          const target = gameData.ships.getShipById(flight.targetId);

          const weapon = this.chooseInterceptor(gameData, flight, usedWeapons);

          if (!weapon) {
            return;
          }

          usedWeapons.push(weapon);
        });
    }
  }

  impactTorpedos(gameData) {}

  moveTorpedos(gameData) {
    gameData.torpedos.getTorpedoFlights().forEach(flight => {
      const currentPosition = flight.position.add(flight.velocity);

      const target = gameData.ships.getShipById(flight.targetId);
      const targetPosition = target.getPosition();
      const torpedoDeltaVelocity =
        HexagonMath.getHexWidth() * flight.torpedo.deltaVelocityPerTurn;

      const difference = targetPosition.sub(currentPosition);
      let move = null;

      if (difference.length() < torpedoDeltaVelocity) {
        move = difference;
        flight.setReachedTarget();
        flight.setImpactAngle(
          getCompassHeadingOfPoint(targetPosition, flight.position)
        );
      } else {
        move = difference.normalize().multiplyScalar(torpedoDeltaVelocity);
      }

      flight.setPosition(currentPosition.add(move));

      flight.setVelocity(flight.velocity.add(move));
    });
  }
}

export default TorpedoHandler;
