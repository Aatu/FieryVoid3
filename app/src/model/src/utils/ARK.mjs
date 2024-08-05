import ARKStep from "./ARKStep.mjs";
import Vector from "./Vector.mjs";

const arkStep = new ARKStep();

const MAX_ERROR = 0.001;
const MIN_ERROR = MAX_ERROR / 100;

class ARK {
  constructor(gameTerrain) {
    this.gameTerrain = gameTerrain;
  }

  calculateNewPositionVelocity(position, velocity, turn) {
    let dt = 0.1;
    let currentTime = 0;

    let positions = [position.clone()];
    /*
    console.log(
      "startPosition",
      position.toString(),
      "startVelocity",
      velocity.toString()
    );
*/

    const parent = this.gameTerrain.getParentEntity(position, turn);

    if (!parent) {
      const endPosition = position.add(velocity);
      positions.push(endPosition);
      return {
        position: endPosition,
        velocity,
        positions,
        collision: false
      };
    }

    const parentMass = parent.mass;
    const parentPosition = parent.position;

    while (currentTime < 1 && dt <= 1) {
      if (parent && parentPosition.distanceTo(position) < 100) {
        positions.push(parentPosition.clone());
        return {
          position: parentPosition.clone(),
          velocity: new Vector(0, 0),
          positions,
          collision: true
        };
      }

      const { dPosition, dVelocity, error } = arkStep
        .setValues(position, velocity, parentPosition, parentMass, dt)
        .calculate();
      //console.log("dt", dt, "currentTime", currentTime);

      if (error > MAX_ERROR) {
        dt = dt * 0.5;
        continue;
      } else if (error < MIN_ERROR) {
        dt = dt * 2;
        continue;
      } else if (currentTime + dt > 1) {
        break;
      } else {
        position = position.add(dPosition);
        velocity = velocity.add(dVelocity);
        positions.push(position.clone());

        //console.log("step", position.toString(), "delta time", dt);

        currentTime += dt;
      }
    }

    dt = 1 - currentTime;
    currentTime = 1;

    const { dPosition: fDPosition, dVelocity: fDVelocity } = arkStep
      .setValues(position, velocity, parentPosition, parentMass, dt)
      .calculate();

    position = position.add(fDPosition);
    velocity = velocity.add(fDVelocity);
    positions.push(position.clone());
    /*
    console.log(currentTime);

    console.log(
      "endPosition",
      position.toString(),
      "endVelocity",
      velocity.toString()
    );
    */
    return {
      position,
      velocity,
      positions,
      collision: false
    };
  }
}

export default ARK;
