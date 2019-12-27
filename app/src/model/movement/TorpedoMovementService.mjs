import coordinateConverter from "../utils/CoordinateConverter.mjs";
import HexagonMath from "../utils/HexagonMath.mjs";
import Vector from "../utils/Vector.mjs";

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

  /*
  addSimulatedAccelerationForImpactTurn(flight, targetPosition) {
    const difference = flight.position
      .add(flight.velocity)
      .sub(targetPosition)
      .length();

    flight.velocity = flight.velocity.add(
      flight.velocity.normalize().multiplyScalar(difference)
    );
  }
  */

  predictTorpedoHitPositionAndTurn(flight, target) {
    const turns = flight.torpedo.turnsToLive * 2;

    for (let impactTurn = 1; impactTurn <= turns; impactTurn++) {
      const impactPosition = this.predictTorpedoHitPositionForTurn(
        flight,
        target,
        impactTurn
      );

      if (impactPosition !== false) {
        let effectiveness = 0;
        let note = "";

        if (
          impactTurn > flight.torpedo.armingTime &&
          impactTurn <= flight.torpedo.turnsToLive
        ) {
          effectiveness = impactPosition.relativeVelocityRatio;
        }

        if (impactTurn <= flight.torpedo.armingTime) {
          note = "No time to arm torpedo";
        }

        if (impactTurn > flight.torpedo.turnsToLive) {
          note = "Out of range";
        }

        return {
          impactTurn,
          impactPosition: impactPosition.position,
          relativeVelocity: impactPosition.relativeVelocity,
          relativeVelocityRatio: impactPosition.relativeVelocityRatio,
          effectiveness,
          note
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
      this.moveTorpedo(testFlight, targetPosition);
    }

    if (this.reachesTargetThisTurn(testFlight, targetPosition)) {
      //this.addSimulatedAccelerationForImpactTurn(testFlight, targetPosition);

      const relativeVelocity = this.getTorpedoRelativeVelocity(
        testFlight,
        target
      );

      return {
        position: targetPosition,
        relativeVelocity,
        relativeVelocityRatio: testFlight.getRelativeVelocityRatio(
          relativeVelocity
        )
      };
    } else {
      return false;
    }
  }

  getTorpedoRelativeVelocity(flight, target) {
    const relativeVelocity = Math.round(
      target
        .getVelocity()
        .sub(flight.velocity)
        .length() / HexagonMath.getHexWidth()
    );

    return relativeVelocity;
  }
}

export default TorpedoMovementService;
