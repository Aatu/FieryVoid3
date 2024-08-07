import Ship from "../unit/Ship";
import CargoEntity from "../unit/system/cargo/CargoEntity";
import { SYSTEM_HANDLERS } from "../unit/system/strategy/types/SystemHandlersTypes";

export type CargoEntry<T extends CargoEntity = CargoEntity> = {
  object: T;
  amount: number;
};

class CargoService {
  divideCargo(ship: Ship, cargo: CargoEntry) {
    if (!this.hasSpaceFor(ship, cargo)) {
      throw new Error(
        "Ship has no cargo space for this. Check validity first!"
      );
    }
    const cargoBays = this.getBaysWithSpace(ship);

    let amount = cargo.amount;
    while (amount > 0) {
      cargoBays.forEach((system) => {
        if (
          amount > 0 &&
          system.callHandler(
            SYSTEM_HANDLERS.hasSpaceFor,
            { object: cargo.object, amount: 1 },
            false
          )
        ) {
          system.callHandler(
            SYSTEM_HANDLERS.addCargo,
            {
              object: cargo.object,
              amount: 1,
            },
            undefined
          );
          amount--;
        }
      });
    }
  }

  hasSpaceForHowMany(ship: Ship, cargo: CargoEntry) {
    const space = this.getShipWideCargoSpaceAvailable(ship);
    return Math.floor(space / cargo.object.getSpaceRequired());
  }

  hasSpaceFor(ship: Ship, cargo: CargoEntry) {
    return (
      this.getShipWideCargoSpaceAvailable(ship) >=
      cargo.object.getSpaceRequired() * cargo.amount
    );
  }

  getShipWideCargoSpaceAvailable(ship: Ship) {
    return this.getBaysWithSpace(ship).reduce(
      (total, system) =>
        total +
        system.callHandler(SYSTEM_HANDLERS.getAvailableCargoSpace, {}, 0),
      0
    );
  }

  getBaysWithSpace(ship: Ship) {
    return ship.systems
      .getSystems()
      .filter((system) => !system.isDestroyed())
      .filter(
        (system) =>
          system.callHandler(SYSTEM_HANDLERS.getAvailableCargoSpace, {}, 0) > 0
      );
  }
}

export default CargoService;
