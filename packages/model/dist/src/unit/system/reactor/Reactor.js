import ShipSystem from "../ShipSystem";
import PowerOutputSystemStrategy from "../strategy/PowerOutputSystemStrategy";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";
class Reactor extends ShipSystem {
    constructor(args, output) {
        super(args, [new PowerOutputSystemStrategy(output)]);
    }
    getDisplayName() {
        return "Reactor";
    }
    getBackgroundImage() {
        return "/img/system/reactor.png";
    }
    getIconText() {
        return this.callHandler(SYSTEM_HANDLERS.getPowerOutput, null, 0).toString();
    }
}
export default Reactor;
