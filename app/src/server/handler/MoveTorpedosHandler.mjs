import HexagonMath from "../../model/utils/HexagonMath.mjs";

class MoveTorpedosHandler {
  advance(gameData) {
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
      } else {
        move = difference.normalize().multiplyScalar(torpedoDeltaVelocity);
      }

      flight.setPosition(currentPosition.add(move));

      flight.setVelocity(flight.velocity.add(move));
    });
  }
}

export default MoveTorpedosHandler;
