import { shuffleArray } from "../utils/math";
export class ShipCargo {
    ship;
    constructor(ship) {
        this.ship = ship;
    }
    canMove(from, to, cargo) {
        if (!from.handlers.isCargoBay() || !to.handlers.isCargoBay()) {
            return false;
        }
        if (!this.systemhasCargoSpaceFor(to, cargo)) {
            return false;
        }
        if (from.isDestroyed() || to.isDestroyed()) {
            return false;
        }
        if (!from.handlers.hasCargo(cargo)) {
            return false;
        }
        return true;
    }
    hasCargo(cargo) {
        cargo = [].concat(cargo);
        const allCargo = this.getAllCargo();
        return cargoContains(allCargo, cargo);
    }
    getAllCargo() {
        return combineCargoEntrys(this.ship.systems
            .getSystems()
            .reduce((total, s) => [...total, ...s.handlers.getAllCargo()], []));
    }
    removeAllCargo() {
        this.ship.systems.getSystems().forEach((s) => s.handlers.removeAllCargo());
    }
    removeCargo(cargo) {
        cargo = [].concat(cargo);
        const cargoBays = this.ship.systems
            .getSystems()
            .filter((s) => s.handlers.isCargoBay());
        let removed = true;
        while (removed) {
            removed = false;
            cargo.forEach((entry) => {
                shuffleArray(cargoBays);
                cargoBays.forEach((bay) => {
                    if (entry.amount === 0) {
                        return;
                    }
                    if (bay.handlers.hasCargo(entry.clone().setAmount(1))) {
                        bay.handlers.removeCargo(entry.clone().setAmount(1));
                        removed = true;
                        entry.amount--;
                    }
                });
            });
        }
        if (cargo.some((c) => c.amount !== 0)) {
            throw new Error("Failed to remove all cargo, check has cargo first");
        }
    }
    moveCargo(from, to, cargo) {
        cargo = [].concat(cargo);
        if (!this.canMove(from, to, cargo)) {
            throw new Error("Invalid cargo move");
        }
        to.handlers.addCargo(cargo);
        from.handlers.removeCargo(cargo);
    }
    addCargo(cargo) {
        cargo = [].concat(cargo);
        const cargoBays = this.ship.systems
            .getSystems()
            .filter((s) => s.handlers.isCargoBay());
        let added = true;
        while (added) {
            added = false;
            cargo.forEach((entry) => {
                shuffleArray(cargoBays);
                cargoBays.forEach((bay) => {
                    if (entry.amount === 0) {
                        return;
                    }
                    if (bay.handlers.canAcceptCargo(entry.clone().setAmount(1))) {
                        bay.handlers.addCargo(entry.clone().setAmount(1));
                        added = true;
                        entry.amount--;
                    }
                });
            });
        }
    }
    systemhasCargoSpaceFor(system, entry) {
        if (system.isDestroyed()) {
            return false;
        }
        const spaceRequired = []
            .concat(entry)
            .reduce((total, { object, amount }) => total + object.getSpaceRequired() * amount, 0);
        return system.handlers.getAvailableCargoSpace() >= spaceRequired;
    }
}
/*
type systemCargo = {
  system: ShipSystem;
  cargo: CargoEntry[];
};


const takeCargoOnShip = (cargoOnShip: systemCargo[], toTake: CargoEntry) => {
  let found: ShipSystem | null = null;
  cargoOnShip.forEach((shipCargo) => {
    if (found) {
      return;
    }

    const entry = shipCargo.cargo.find((c) => c.object.equals(toTake.object));

    if (entry) {
      entry.amount--;
      found = shipCargo.system;
    }
  });

  return found;
};

const getAllMatchingCargoInShip = (
  ship: Ship,
  desiredCargo: systemCargo[]
): systemCargo[] => {
  const cargoClasses: CargoType[] = [];

  desiredCargo.forEach(({ cargo }) =>
    cargo.forEach((entry: CargoEntry) => {
      if (cargoClasses.includes(entry.object.getCargoClassName())) {
        return false;
      } else {
        cargoClasses.push(entry.object.getCargoClassName());
      }
    })
  );

  const shipCargo: systemCargo[] = ship.systems
    .getSystems()
    .filter((s) => s.handlers.isCargoBay())
    .map((system) => {
      const systemCargo = system.handlers
        .getAllCargo()
        .filter((e) => cargoClasses.includes(e.object.getCargoClassName()));

      return {
        system,
        cargo: systemCargo,
      };
    });

  return shipCargo;
};

*/
export const subtractCargos = (current, sub) => combineCargoEntrys([...current, ...sub.map((s) => s.clone().flipAmount())]);
export const addCargos = (current, add) => combineCargoEntrys([...current, ...add]);
export const cargoContains = (current, other) => subtractCargos(current, other).every((c) => c.amount >= 0);
export const combineCargoEntrys = (entries) => {
    const newEntries = [];
    entries.forEach((entry) => {
        const newEntry = newEntries.find((e) => e.object.equals(entry.object));
        if (!newEntry) {
            newEntries.push(entry.clone());
        }
        else {
            newEntry.amount += entry.amount;
        }
    });
    return newEntries;
};
