import Ship from "../unit/Ship";
import { THRUSTER_DIRECTION } from "../unit/system/strategy/ThrustChannelSystemStrategy";
import { SYSTEM_HANDLERS } from "../unit/system/strategy/types/SystemHandlersTypes.js";
import { MovementOrder, RequiredThrust, ThrustAssignment } from "./index";
import { ThrustRequirementSummary } from "./RequiredThrust";

class ThrustBill {
  private ship: Ship;
  private movement: MovementOrder[];
  private thrusters: ThrustAssignment[];
  private fuel: number;
  private paid: boolean | null = null;
  private directionsRequired: ThrustRequirementSummary;

  constructor(ship: Ship, movement: MovementOrder[]) {
    this.ship = ship;
    this.movement = movement.map((move) => move.clone());
    this.thrusters = ship.systems
      .getSystems()
      .filter((system) =>
        system.callHandler(SYSTEM_HANDLERS.isThruster, null, false)
      )
      .filter((system) => !system.isDisabled())
      .map((thruster) => new ThrustAssignment(thruster));

    this.buildRequiredThrust(this.movement);

    this.fuel = this.ship.movement.getFuel();

    this.paid = null;

    this.directionsRequired = this.getRequiredThrustDirections();
  }

  getRequiredThrustDirections() {
    const result = {
      [THRUSTER_DIRECTION.FORWARD]: 0,
      [THRUSTER_DIRECTION.STARBOARD_FORWARD]: 0,
      [THRUSTER_DIRECTION.STARBOARD_AFT]: 0,
      [THRUSTER_DIRECTION.AFT]: 0,
      [THRUSTER_DIRECTION.PORT_FORWARD]: 0,
      [THRUSTER_DIRECTION.PORT_AFT]: 0,
      [THRUSTER_DIRECTION.PIVOT_RIGHT]: 0,
      [THRUSTER_DIRECTION.PIVOT_LEFT]: 0,
      [THRUSTER_DIRECTION.MANOUVER]: 0,
    };

    this.movement.forEach((move) => move.requiredThrust.accumulate(result));

    return result;
  }

  getTotalThrustRequired() {
    const totalRequired = this.getRequiredThrustDirections();
    return (
      totalRequired[0] +
      totalRequired[1] +
      totalRequired[2] +
      totalRequired[3] +
      totalRequired[4] +
      totalRequired[5] +
      totalRequired[6] +
      totalRequired[7] +
      totalRequired[8]
    );
  }

  getCurrentThrustRequired() {
    return (
      this.directionsRequired[0] +
      this.directionsRequired[1] +
      this.directionsRequired[2] +
      this.directionsRequired[3] +
      this.directionsRequired[4] +
      this.directionsRequired[5] +
      this.directionsRequired[6] +
      this.directionsRequired[7] +
      this.directionsRequired[8]
    );
  }

  isPaid() {
    /*
    console.log(
      "isPaid, required",
      this.getCurrentThrustRequired(),
      "this.fuel",
      this.fuel,
      "fuel required",
      this.totalFuelRequirement()
    );
    */
    return (
      this.getCurrentThrustRequired() === 0 &&
      this.fuel >= this.totalFuelRequirement()
    );
  }

  totalFuelRequirement() {
    return this.thrusters.reduce(
      (all, thruster) => all + thruster.getFuelRequirement(),
      0
    );
  }

  getAllUsableThrusters(direction: THRUSTER_DIRECTION) {
    return this.thrusters
      .filter((thruster) => {
        const capacity = thruster.getThrustCapacity();

        return (
          thruster.isDirection(direction) &&
          capacity > 0 &&
          this.fuel >= thruster.getNextThrustFuelCost()
        );
      })
      .sort(this.sortThrusters);
  }

  sortThrusters(a: ThrustAssignment, b: ThrustAssignment) {
    const { overheatPercentage: aHeat, coolingPercent: aCooling } =
      a.getOverheat();
    const { overheatPercentage: bHeat, coolingPercent: bCooling } =
      b.getOverheat();

    if (aHeat > bHeat) {
      return -1;
    }

    if (aHeat < bHeat) {
      return 1;
    }

    if (aCooling > bCooling) {
      return -1;
    }

    if (aCooling < bCooling) {
      return 1;
    }

    if (a.getNextThrustFuelCost() > b.getNextThrustFuelCost()) {
      return -1;
    }

    if (a.getNextThrustFuelCost() < b.getNextThrustFuelCost()) {
      return 1;
    }

    if (a.channeled > b.channeled) {
      return -1;
    }

    if (a.channeled < b.channeled) {
      return 1;
    }

    return 0;
  }

  pay() {
    if (this.paid !== null) {
      throw new Error("Thrust bill is already paid!");
    }

    try {
      this.process();

      this.paid = this.isPaid();
      return this.paid;
    } catch (e: unknown) {
      if ((e as { message: string })?.message === "over budget") {
        this.paid = false;
        return this.paid;
      }

      throw e;
    }
  }

  process() {
    Object.keys(this.directionsRequired).forEach((directionString) => {
      const direction = parseInt(directionString, 10) as THRUSTER_DIRECTION;
      const required = this.directionsRequired[direction];

      if (required === 0) {
        return;
      }

      this.useThrusters(direction, required);
    });

    return this.isPaid();
  }

  useThrusters(direction: THRUSTER_DIRECTION, required: number) {
    let assigned = 0;

    while (true) {
      const thrusters = this.getAllUsableThrusters(direction);

      if (assigned === required) {
        return;
      }

      if (thrusters.length === 0) {
        return;
      }

      const thruster = thrusters[thrusters.length - 1];
      thruster.channel(1);
      this.directionsRequired[direction] -= 1;
      assigned += 1;
    }
  }

  buildRequiredThrust(movement: MovementOrder[]) {
    movement.forEach((move) =>
      move.setRequiredThrust(new RequiredThrust().calculate(this.ship, move))
    );
  }

  getMoves() {
    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((direction) => {
      this.thrusters.forEach((thruster) => {
        if (!thruster.isDirection(direction)) {
          return;
        }

        let free = thruster.channeled - thruster.assigned;

        if (free === 0) {
          return;
        }

        this.movement.forEach((move) => {
          const required = move.requiredThrust.getRequirement(direction);

          if (required === 0) {
            return;
          }

          if (required > free) {
            move.requiredThrust.fulfill(direction, free, thruster.thruster);
            thruster.addAssigned(free);
            free = 0;
          } else {
            move.requiredThrust.fulfill(direction, required, thruster.thruster);
            thruster.addAssigned(required);
            free -= required;
          }
        });
      });
    });

    if (!this.movement.every((move) => move.requiredThrust.isFulfilled())) {
      throw new Error("Not all moves are fulfilled");
    }

    return this.movement;
  }
}

export default ThrustBill;
