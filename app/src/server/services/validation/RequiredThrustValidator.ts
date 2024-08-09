import { MovementOrder, RequiredThrust } from "../../../model/src/movement";
import Ship from "../../../model/src/unit/Ship";
import ShipSystem from "../../../model/src/unit/system/ShipSystem";
import { THRUSTER_DIRECTION } from "../../../model/src/unit/system/strategy/ThrustChannelSystemStrategy";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import { InvalidGameDataError } from "../../errors/index";

class RequiredThrustValidator {
  private ship: Ship;
  private move: MovementOrder;
  private requirement: RequiredThrust;

  constructor(ship: Ship, move: MovementOrder) {
    this.ship = ship;
    this.move = move;
    this.requirement = new RequiredThrust().calculate(ship, move);
  }

  validateRequirementsAreCorrect(requiredThrust: RequiredThrust) {
    if (
      JSON.stringify(this.requirement.requirements) !==
      JSON.stringify(requiredThrust.requirements)
    ) {
      throw new InvalidGameDataError(`Requirements are not correct.`);
    }

    return true;
  }

  getThrustChanneledBy(thruster: ShipSystem, requiredThrust: RequiredThrust) {
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

  ensureThrustersAreValid(requiredThrust: RequiredThrust) {
    return Object.keys(requiredThrust.fullfilments).every((directionString) => {
      const direction = parseInt(directionString, 10) as THRUSTER_DIRECTION;
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

        if (
          !thruster.callHandler(
            SYSTEM_HANDLERS.isDirection,
            direction,
            false as boolean
          )
        ) {
          throw new InvalidGameDataError(
            `Thruster id ${thrusterId} is not direction ${direction}.`
          );
        }

        return true;
      });
    });
  }

  isPaid(requiredThrust: RequiredThrust) {
    return Object.keys(this.requirement.requirements).every(
      (directionString) => {
        const direction = parseInt(directionString, 10) as THRUSTER_DIRECTION;

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
      }
    );
  }
}

export default RequiredThrustValidator;
