import { SYSTEM_HANDLERS } from "../unit/system/strategy/types/SystemHandlersTypes";
class CargoService {
    divideCargo(ship, cargo) {
        if (!this.hasSpaceFor(ship, cargo)) {
            throw new Error("Ship has no cargo space for this. Check validity first!");
        }
        const cargoBays = this.getBaysWithSpace(ship);
        let amount = cargo.amount;
        while (amount > 0) {
            cargoBays.forEach((system) => {
                if (amount > 0 &&
                    system.callHandler(SYSTEM_HANDLERS.hasSpaceFor, { object: cargo.object, amount: 1 }, false)) {
                    system.callHandler(SYSTEM_HANDLERS.addCargo, {
                        object: cargo.object,
                        amount: 1,
                    }, undefined);
                    amount--;
                }
            });
        }
    }
    hasSpaceForHowMany(ship, cargo) {
        const space = this.getShipWideCargoSpaceAvailable(ship);
        return Math.floor(space / cargo.object.getSpaceRequired());
    }
    hasSpaceFor(ship, cargo) {
        return (this.getShipWideCargoSpaceAvailable(ship) >=
            cargo.object.getSpaceRequired() * cargo.amount);
    }
    getShipWideCargoSpaceAvailable(ship) {
        return this.getBaysWithSpace(ship).reduce((total, system) => total +
            system.callHandler(SYSTEM_HANDLERS.getAvailableCargoSpace, {}, 0), 0);
    }
    getBaysWithSpace(ship) {
        return ship.systems
            .getSystems()
            .filter((system) => !system.isDestroyed())
            .filter((system) => system.callHandler(SYSTEM_HANDLERS.getAvailableCargoSpace, {}, 0) > 0);
    }
}
export default CargoService;
