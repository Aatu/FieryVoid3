import ShipSystemStrategy from "./ShipSystemStrategy";
import { CargoEntry } from "../../../cargo/CargoEntry";
import { addCargos, cargoContains, subtractCargos } from "../../ShipCargo";
class CargoBaySystemStrategy extends ShipSystemStrategy {
    space;
    cargo;
    allowedCargoClasses = null;
    constructor(space, allowedCargoClasses) {
        super();
        this.space = space;
        this.cargo = [];
        this.allowedCargoClasses = allowedCargoClasses || null;
    }
    getUiComponents(payload, previousResponse = []) {
        return [
            ...previousResponse,
            {
                name: "CargoList",
                props: {
                    list: this.cargo.map((cargo) => ({
                        object: cargo.object,
                        amount: cargo.amount,
                    })),
                },
            },
        ];
    }
    serialize(payload, previousResponse = {}) {
        return {
            ...previousResponse,
            cargoBaySystemStrategy: {
                cargo: this.cargo.map((cargo) => cargo.serialize()),
            },
        };
    }
    deserialize(data = {}) {
        const systemData = data?.cargoBaySystemStrategy;
        this.cargo = systemData?.cargo.map((c) => CargoEntry.deserialize(c)) ?? [];
        return this;
    }
    canAcceptCargo(cargo) {
        cargo = [].concat(cargo);
        const spaceRequired = cargo.reduce((total, entry) => total + entry.object.getSpaceRequired() * entry.amount, 0);
        if (this.getAvailableCargoSpace() < spaceRequired) {
            return false;
        }
        if (this.allowedCargoClasses !== null &&
            cargo.some((c) => !this.allowedCargoClasses?.includes(c.object.getCargoClassName()))) {
            return false;
        }
        return true;
    }
    getTotalCargoSpace() {
        return this.space;
    }
    getAvailableCargoSpace() {
        return this.space - this.getCargoSpaceUsed();
    }
    getAllCargo() {
        return this.cargo.map((c) => c.clone());
    }
    getCargoSpaceUsed() {
        return this.cargo.reduce((total, { object, amount }) => total + object.getSpaceRequired() * amount, 0);
    }
    getCargoEntry(object) {
        if (this.getSystem().isDestroyed()) {
            return null;
        }
        return (this.cargo.find((stored) => stored.object.constructor === object.constructor) || null);
    }
    isAllowedCargo(cargo) {
        return (!this.allowedCargoClasses ||
            !this.allowedCargoClasses.includes(cargo.object.getCargoClassName()));
    }
    hasCargo(payload) {
        payload = [].concat(payload);
        return cargoContains(this.cargo, payload);
    }
    removeAllCargo() {
        this.cargo = [];
    }
    removeCargo(cargo) {
        cargo = [].concat(cargo);
        const newCargo = subtractCargos(this.cargo, cargo);
        this.cargo = newCargo.filter((c) => c.amount > 0);
    }
    addCargo(cargo) {
        cargo = [].concat(cargo);
        const newCargo = addCargos(this.cargo, cargo);
        this.cargo = newCargo;
    }
    isCargoBay() {
        return true;
    }
    receivePlayerData({ clientShip, clientSystem, }) {
        if (!clientSystem) {
            return;
        }
        if (this.getSystem().power.isOffline()) {
            //this is fine
        }
        else if (this.getSystem().isDisabled()) {
            return;
        }
        //TODO: system to allow player to move cargo
    }
}
export default CargoBaySystemStrategy;
