import coordinateConverter from "../utils/CoordinateConverter.mjs";
import HexagonMath from "../utils/HexagonMath.mjs";
import Vector from "../utils/Vector.mjs";
import THREE from "three";

class TorpedoMovementService {
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
    console.log(
      flight.position,
      flight.velocity,
      target.getPosition(),
      target.getVelocity(),
      flight.torpedo.deltaVelocityPerTurn * HexagonMath.getHexWidth()
    );
    const result = this.torpedoMath(
      flight.position,
      flight.velocity,
      target.getPosition(),
      target.getVelocity(),
      flight.torpedo.deltaVelocityPerTurn * HexagonMath.getHexWidth()
    );

    const maxInterceptVelocity = flight.torpedo.maxInterceptVelocity;

    let velocity = result.impactVelocity / HexagonMath.getHexWidth();

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
      impactVelocity: Math.round(
        result.impactVelocity / HexagonMath.getHexWidth()
      ),
      effectiveness
    };
  }

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

    let result = null;

    if (
      Math.pow(newShooterVelocity.y, 2) / (torpedoAcceleration * x) <
      Math.pow(10, -7)
    ) {
      const impactTurn =
        (-newShooterVelocity.x +
          Math.sqrt(
            Math.pow(newShooterVelocity.x, 2) + 2 * torpedoAcceleration * x
          )) /
        torpedoAcceleration;

      result = {
        accelerationAngle: φ,
        impactTurn
      };
    } else if (newShooterVelocity.y > 0) {
      const θ = this.findRoot(
        newTargetPosition.x,
        newShooterVelocity.x,
        newShooterVelocity.y,
        torpedoAcceleration
      );

      const impactTurn =
        -(2 * newShooterVelocity.y) / (torpedoAcceleration * Math.sin(θ));

      result = {
        accelerationAngle: θ + φ,
        impactTurn
      };
    } else {
      const θ = this.findRoot(
        newTargetPosition.x,
        newShooterVelocity.x,
        -newShooterVelocity.y,
        torpedoAcceleration
      );

      const impactTurn =
        (2 * newShooterVelocity.y) / (torpedoAcceleration * Math.sin(θ));

      result = {
        accelerationAngle: 2 * Math.PI - θ + φ,
        impactTurn
      };
    }

    const impactVelocity = Math.sqrt(
      Math.pow(
        -newShooterVelocity.x +
          targetVelocity.x -
          torpedoAcceleration *
            result.impactTurn *
            Math.cos(result.accelerationAngle),
        2
      ) +
        Math.pow(
          -newShooterVelocity.y +
            targetVelocity.y -
            torpedoAcceleration *
              result.impactTurn *
              Math.sin(result.accelerationAngle),
          2
        )
    );

    const accelerationVector = new Vector(
      Math.cos(result.accelerationAngle),
      Math.sin(result.accelerationAngle)
    ).normalize();

    if (
      Number.isNaN(result.accelerationAngle) ||
      Number.isNaN(result.impactTurn) ||
      Number.isNaN(accelerationVector) ||
      Number.isNaN(impactVelocity)
    ) {
      throw new Error(
        `Torpedo math encountered NaN with values '${shooterPosition.toString()}, '${shooterVelocity.toString()}, '${targetPosition.toString()}, '${targetVelocity.toString()},'${torpedoAcceleration}'`
      );
    }

    const impactPosition = shooterPosition
      .add(shooterVelocity.multiplyScalar(impactTurn))
      .add(
        accelerationVector.multiplyScalar(
          0.5 * torpedoAcceleration * Math.pow(impactTime, 2)
        )
      );

    return { ...result, accelerationVector, impactVelocity, impactPosition };
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
