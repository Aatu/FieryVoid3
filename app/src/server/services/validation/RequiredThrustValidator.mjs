import RequiredThrust from "../../../model/movement/RequiredThrust";
import { InvalidGameDataError } from "../../errors";

class RequiredThrustValidator {
  constructor(ship, move) {
    this.ship = ship;
    this.move = move;
    this.requirement = new RequiredThrust(ship, move);
  }

  validateRequirementsAreCorrect(requiredThrust) {
    if (
      JSON.stringify(this.requirement.requirements) !==
      JSON.stringify(requiredThrust.requirements)
    ) {
      throw new InvalidGameDataError(`Requirements are not correct.`);
    }

    return true;
  }

  getThrustChanneledBy(thruster, requiredThrust) {
    return requiredThrust
      .getFulfilments()
      .flat()
      .reduce((acc, fullfilment) => {
        if (fullfilment.thrusterId === thruster.id) {
          return acc + fullfilment.amount;
        }
        return acc;
      }, 0);
  }

  ensureThrustersAreValid(requiredThrust) {
    return Object.keys(requiredThrust.fullfilments).every(direction => {
      return requiredThrust.fullfilments[direction].every(({ thrusterId }) => {
        const thruster = this.ship.systems.getSystemById(thrusterId);

        if (!thruster) {
          throw new InvalidGameDataError(
            `Thruster id '${thrusterId}' not found`
          );
        }

        if (thruster.isDisabled()) {
          throw new InvalidGameDataError(
            `Thruster id '${thrusterId}' is disabled`
          );
        }

        const thrusterDirection = thruster.callHandler("getThrustDirection");
        if (thrusterDirection !== parseInt(direction, 10)) {
          throw new InvalidGameDataError(
            `Thruster id ${thrusterId} is not direction ${direction}. Instead is ${thrusterDirection}`
          );
        }

        return true;
      });
    });
  }

  isPaid(requiredThrust) {
    return Object.keys(this.requirement.requirements).every(direction => {
      let required = this.requirement.requirements[direction];

      requiredThrust.fullfilments[direction].forEach(({ amount }) => {
        required -= amount;
      });

      if (required !== 0) {
        throw new InvalidGameDataError(
          `Unpaid thrust: ${required} for direction ${direction}`
        );
      }

      return true;
    });
  }
}

export default RequiredThrustValidator;
