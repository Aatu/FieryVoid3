import coordinateConverter from "../utils/CoordinateConverter.mjs";
import HexagonMath from "../utils/HexagonMath.mjs";

class TorpedoMovementService {
  reachesTargetThisTurn(flight, targetPosition) {
    const torpedoCurrentHexPosition = coordinateConverter.fromGameToHex(
      flight.position
    );
    const torpedoVelocityHexPosition = coordinateConverter.fromGameToHex(
      flight.position.add(flight.velocity)
    );

    const targetHexPosition = coordinateConverter.fromGameToHex(targetPosition);

    const torpedoDeltaVelocity = flight.torpedo.deltaVelocityPerTurn;

    const hexas = torpedoCurrentHexPosition.drawLine(
      torpedoVelocityHexPosition
    );

    const hit = hexas.find(
      hex => hex.distanceTo(targetHexPosition) <= torpedoDeltaVelocity
    );

    return Boolean(hit);
  }

  moveTorpedo(flight, targetPosition) {
    const currentPosition = flight.position.add(flight.velocity);
    const torpedoDeltaVelocity =
      HexagonMath.getHexWidth() * flight.torpedo.deltaVelocityPerTurn;

    const difference = targetPosition.sub(currentPosition);
    const move = difference.normalize().multiplyScalar(torpedoDeltaVelocity);
    flight.setPosition(currentPosition.add(move));
    flight.setVelocity(flight.velocity.add(move));
  }

  predictTorpedoHitPositionAndTurn(flight, target) {
    const turns = flight.torpedo.turnsToLive * 2;

    for (let impactTurn = 1; impactTurn <= turns; impactTurn++) {
      const impactPosition = this.predictTorpedoHitPositionForTurn(
        flight,
        target,
        impactTurn
      );

      if (impactPosition !== false) {
        return {
          impactTurn,
          impactPosition
        };
      }
    }

    return false;
  }

  predictTorpedoHitPositionForTurn(flight, target, turns) {
    const testFlight = flight.clone();

    const targetPosition = target
      .getPosition()
      .add(target.getVelocity().multiplyScalar(turns));

    for (let torpedoTurn = 1; torpedoTurn < turns; torpedoTurn++) {
      if (this.reachesTargetThisTurn(testFlight, targetPosition)) {
        return false;
      }
      this.moveTorpedo(testFlight, targetPosition);
    }

    if (this.reachesTargetThisTurn(testFlight, targetPosition)) {
      return targetPosition;
    } else {
      return false;
    }
  }
}

export default TorpedoMovementService;
