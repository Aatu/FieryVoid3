import ShipSystem from "../ShipSystem";
import FuelTankSystemStrategy from "../strategy/FuelTankSystemStrategy";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";
class FuelTank extends ShipSystem {
    constructor(args, space) {
        super(args, [new FuelTankSystemStrategy(space)]);
    }
    getDisplayName() {
        return `Fuel tank ${this.callHandler(SYSTEM_HANDLERS.getFuelSpace, undefined, 0)}m³`;
    }
    getBackgroundImage() {
        return "/img/system/fuelTank.png";
    }
}
export default FuelTank;
