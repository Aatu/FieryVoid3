import { DiceRoller } from "../../../utils/DiceRoller";
class ShipSystemStrategy {
    system = null;
    diceRoller;
    constructor() {
        this.system = null;
        this.diceRoller = new DiceRoller();
    }
    init(system) {
        this.system = system;
    }
    getSystem() {
        if (!this.system) {
            throw new Error("System not initialized");
        }
        return this.system;
    }
    getShip() {
        return this.getSystem().getShipSystems().ship;
    }
    getShipSystems() {
        return this.getSystem().getShipSystems();
    }
    getSystems() {
        return this.getShipSystems().getSystems();
    }
    getSystemById(id) {
        return this.getShipSystems().getSystemById(id);
    }
    callHandler = (name, payload = {}, previousResponse) => {
        // @ts-expect-error I dont know how to type this
        if (!this[name]) {
            return previousResponse;
        }
        // @ts-expect-error I dont know how to type this
        return this[name](payload, previousResponse);
    };
}
export default ShipSystemStrategy;
