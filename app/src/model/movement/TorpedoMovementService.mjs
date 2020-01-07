import coordinateConverter from "../utils/CoordinateConverter.mjs";
import HexagonMath from "../utils/HexagonMath.mjs";
import Vector from "../utils/Vector.mjs";
import * as THREE from "three";

class TorpedoMovementService {
  /*
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
  */

  moveTorpedo(flight, target) {
    const { accelerationVector } = this.torpedoMath(
      flight.position,
      flight.velocity,
      target.getPosition(),
      target.getVelocity(),
      flight.torpedo.deltaVelocityPerTurn * HexagonMath.getHexWidth()
    );

    flight.velocity = flight.velocity.add(
      accelerationVector.multiplyScalar(flight.torpedo.deltaVelocityPerTurn)
    );
    flight.position = flight.position.add(flight.velocity);
  }

  predictTorpedoHitPositionAndTurn(flight, target) {
    const result = this.torpedoMath(
      flight.position,
      flight.velocity,
      target.getPosition(),
      target.getVelocity(),
      flight.torpedo.deltaVelocityPerTurn * HexagonMath.getHexWidth()
    );

    const maxInterceptVelocity = flight.torpedo.maxInterceptVelocity;

    let velocity = result.impactVelocity;

    if (velocity > maxInterceptVelocity) {
      velocity = maxInterceptVelocity;
    }

    let effectiveness = velocity / maxInterceptVelocity;
    let notes = "";

    if (
      Math.floor(result.impactTurn) + flight.turnsActive <
      flight.torpedo.armingTime
    ) {
      effectiveness = 0;
      notes = "Insufficient time to arm torpedo";
    }

    if (
      Math.floor(result.impactTurn) + flight.turnsActive >
      flight.torpedo.turnsToLive
    ) {
      effectiveness = 0;
      notes = "Out of range";
    }

    return {
      ...result,
      notes,
      effectiveImpactVelocity: velocity,
      effectiveness
    };
  }

  /*
  torpedoMath(
    shooterPosition,
    shooterVelocity,
    targetPosition,
    targetVelocity,
    torpedoAcceleration
  ) {
    const shooterToTargetDistance = shooterPosition.distanceTo(targetPosition);
    const deltaVelocity = shooterVelocity.distanceTo(targetVelocity);
    const dot = shooterPosition
      .sub(targetPosition)
      .dot(shooterVelocity.sub(targetVelocity));

    const delta =
      3 *
        Math.pow(torpedoAcceleration, 2) *
        Math.pow(shooterToTargetDistance, 2) -
      Math.pow(deltaVelocity, 4);

    const sigma =
      -2 * delta * Math.pow(deltaVelocity, 2) + 3 * Math.pow(dot, 2);

    const mu =
      0.5 *
      (-6 * delta * Math.pow(deltaVelocity, 2) +
        18 *
          Math.pow(torpedoAcceleration, 2) *
          delta *
          Math.pow(deltaVelocity, 2) -
        8 * Math.pow(deltaVelocity, 6) +
        9 * Math.pow(torpedoAcceleration, 2) * sigma);

    const lambda = mu + Math.sqrt(Math.pow(delta, 3) + Math.pow(mu, 2));

    const kappa = Math.sqrt(
      2 * Math.pow(deltaVelocity, 2) -
        delta / Math.pow(lambda, 1 / 3) +
        Math.pow(lambda, 1 / 3)
    );

    const roo =
      -8 * Math.pow(deltaVelocity, 4) -
      2 * Math.pow(deltaVelocity, 2) * Math.pow(lambda, 1 / 3) +
      Math.pow(lambda, 2 / 3);

    const A =
      (4 * Math.pow(delta, 4) -
        2 * Math.pow(delta, 3) * roo -
        2 * Math.pow(delta, 2) * Math.pow(lambda, 4 / 3) -
        4 * roo * lambda * mu +
        4 *
          delta *
          lambda *
          (-Math.pow(deltaVelocity, 2) * Math.pow(lambda, 2 / 3) + 2 * mu)) /
      (lambda *
        (2 * Math.pow(deltaVelocity, 2) * lambda +
          Math.pow(lambda, 1 / 3) *
            (lambda - delta * Math.pow(lambda, 1 / 3))));

    const B =
      (12 *
        Math.sqrt(3) *
        dot *
        (Math.pow(delta, 3) + 2 * lambda * mu) *
        torpedoAcceleration *
        Math.sqrt(
          2 * Math.pow(deltaVelocity, 2) +
            (lambda - delta * Math.pow(lambda, 1 / 3)) / Math.pow(lambda, 2 / 3)
        )) /
      (lambda *
        (2 * Math.pow(deltaVelocity, 2) * lambda +
          Math.pow(lambda, 1 / 3) *
            (lambda - delta * Math.pow(lambda, 1 / 3))));

    const resolveTime = () => {
      if (A + B > 0) {
        const a1 =
          (1 / (Math.sqrt(3) * torpedoAcceleration)) *
          (kappa + Math.sqrt((A + B) / 2));

        const a2 =
          (1 / (Math.sqrt(3) * torpedoAcceleration)) *
          (kappa - Math.sqrt((A + B) / 2));

        if (a1 < 0) {
          return a2;
        }

        if (a2 < 0) {
          return a1;
        }

        return a1 < a2 ? a1 : a2;
      } else {
        const a1 =
          (1 / (Math.sqrt(3) * torpedoAcceleration)) *
          (-kappa + Math.sqrt((A - B) / 2));

        const a2 =
          (1 / (Math.sqrt(3) * torpedoAcceleration)) *
          (-kappa - Math.sqrt((A - B) / 2));

        if (a1 < 0) {
          return a2;
        }

        if (a2 < 0) {
          return a1;
        }

        return a1 < a2 ? a1 : a2;
      }
    };

    const T = resolveTime();

    const dVelocity = shooterVelocity.sub(targetVelocity);
    const dPosition = shooterPosition.sub(targetPosition);

    console.log(
      "shooterToTargetDistance",
      shooterToTargetDistance,
      "deltaVelocity",
      deltaVelocity,
      "dot",
      dot,
      "delta",
      delta,
      "sigma",
      sigma,
      "mu",
      mu,
      "lambda",
      lambda,
      "kappa",
      kappa,
      "roo",
      roo,
      "A",
      A,
      "B",
      B,
      "T",
      T
    );

    const sinTheta =
      -(2 * (T * dVelocity.y + dPosition.y)) /
      (torpedoAcceleration * Math.pow(T, 2));

    const cosTheta =
      -(2 * (T * dVelocity.x + dPosition.x)) /
      (torpedoAcceleration * Math.pow(T, 2));

    const theta = Math.atan2(sinTheta, cosTheta);

    const impactVelocity = Math.sqrt(
      Math.pow(
        -shooterVelocity.x +
          targetVelocity.x -
          torpedoAcceleration * T * cosTheta,
        2
      ) +
        Math.pow(
          -shooterVelocity.y +
            targetVelocity.y -
            torpedoAcceleration * T * sinTheta,
          2
        )
    );

    return {
      impactVelocity,
      impactTurn: T,
      accelerationAngle: theta,
      accelerationVector: new Vector(cosTheta, sinTheta)
    };
  }

  */
  standardize(
    shooterPosition,
    shooterVelocity,
    targetPosition,
    targetVelocity
  ) {
    const Δpos = targetPosition.sub(shooterPosition);
    const φ = Math.atan2(Δpos.y, Δpos.x);
    const rotationMatrix = new THREE.Matrix4().makeRotationZ(-φ);
    const newTargetPosition = Δpos.applyMatrix4(rotationMatrix);
    const newShooterVelocity = shooterVelocity
      .sub(targetVelocity)
      .applyMatrix4(rotationMatrix);

    return {
      newTargetPosition,
      newShooterVelocity,
      φ
    };
  }

  torpedoMath(
    shooterPosition,
    shooterVelocity,
    targetPosition,
    targetVelocity,
    torpedoAcceleration
  ) {
    const { newTargetPosition, newShooterVelocity, φ } = this.standardize(
      shooterPosition,
      shooterVelocity,
      targetPosition,
      targetVelocity
    );

    const x = newTargetPosition.x;

    if (
      Math.pow(newShooterVelocity.y, 2) / (torpedoAcceleration * x) <
      Math.pow(10, -7)
    ) {
      const impactTurn =
        (-newShooterVelocity.x +
          Math.sqrt(
            Math.pow(newShooterVelocity.x) + 2 * torpedoAcceleration * x
          )) /
        torpedoAcceleration;

      return {
        angle: φ,
        impactTurn
      };
    }

    if (newShooterVelocity.y > 0) {
      const θ = this.findRoot(
        newTargetPosition.x,
        newShooterVelocity.x,
        newShooterVelocity.y,
        torpedoAcceleration
      );

      const impactTurn =
        -(2 * newShooterVelocity.y) / (torpedoAcceleration * Math.sin(θ));

      return {
        angle: θ + φ,
        impactTurn
      };
    }

    const θ = this.findRoot(
      newTargetPosition.x,
      newShooterVelocity.x,
      -newShooterVelocity.y,
      torpedoAcceleration
    );

    const impactTurn =
      (2 * newShooterVelocity.y) / (torpedoAcceleration * Math.sin(θ));

    return {
      angle: 2 * Math.PI - θ + φ,
      impactTurn
    };
  }

  findRoot(x, vx, vy, a) {
    if (vx / vy - (a * x) / (2 * Math.pow(vy, 2) < 0)) {
      return this.findRoot2(
        x,
        vx,
        vy,
        a,
        (3 * Math.PI) / 2,
        this.findUpperLimit(x, vx, vy, a)
      );
    }

    return this.findRoot2(
      x,
      vx,
      vy,
      a,
      this.findLowerLimit(x, vx, vy, a),
      (3 * Math.PI) / 2
    );
  }

  f(x, vx, vy, a, θ) {
    return (
      Math.cos(θ) / Math.pow(Math.sin(θ), 2) -
      vx / (vy * Math.sin(θ)) -
      (a * x) / (2 * Math.pow(vy, 2))
    );
  }

  findRoot2(x, vx, vy, a, θ1, θ2) {
    let θlow = θ1;
    let θhigh = θ2;
    let θmid = 0;

    while (θhigh - θlow > Math.pow(10, -8)) {
      θmid = (θlow + θhigh) / 2;
      if (this.f(x, vx, vy, a, θmid) > 0) {
        θhigh = θmid;
      } else {
        θlow = θmid;
      }
    }

    return (θlow + θhigh) / 2;
  }

  findUpperLimit(x, vx, vy, a) {
    let i = 1;

    while (true) {
      const argument = 2 * Math.PI - Math.PI / Math.pow(2, i);
      const result = this.f(x, vx, vy, a, argument);

      if (result > 0) {
        return argument;
      }
      i++;
    }
  }

  findLowerLimit(x, vx, vy, a) {
    let i = 1;

    while (true) {
      const argument = Math.PI + Math.PI / Math.pow(2, i);
      const result = this.f(x, vx, vy, a, argument);

      if (result < 0) {
        return argument;
      }
      i++;
    }
  }
}

export default TorpedoMovementService;
