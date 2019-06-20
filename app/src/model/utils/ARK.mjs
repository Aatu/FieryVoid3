import ARKStep from "./ARKStep";
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
    while (currentTime < 1 && dt <= 1) {
      const parent = this.gameTerrain.getParentEntity(
        position,
        currentTime,
        turn
      );

      if (parent.position.distanceTo(position) < 100) {
        positions.push(parent.position.clone());
        return {
          position: parent.position.clone(),
          velocity: new Vector(0, 0),
          positions,
          collision: true
        };
      }

      const { dPosition, dVelocity, error } = arkStep
        .setValues(position, velocity, parent.position, parent.mass, dt)
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

    const fParent = this.gameTerrain.getParentEntity(
      position,
      currentTime,
      turn
    );

    const { dPosition: fDPosition, dVelocity: fDVelocity } = arkStep
      .setValues(position, velocity, fParent.position, fParent.mass, dt)
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
