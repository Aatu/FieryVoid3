import ShipSystemStrategy from "./ShipSystemStrategy";
import { SYSTEM_HANDLERS } from "./types/SystemHandlersTypes";
class FireOrderHeatStrategy extends ShipSystemStrategy {
    heatPerShot;
    constructor(heatPerShot) {
        super();
        this.heatPerShot = heatPerShot;
    }
    generatesHeat() {
        return true;
    }
    getMessages(payload, previousResponse = []) {
        return previousResponse;
    }
    getHeatGenerated(payload, previousResponse = 0) {
        const fireOrders = this.getSystem().callHandler(SYSTEM_HANDLERS.getFireOrders, null, []);
        if (fireOrders.length > 0) {
            return previousResponse + fireOrders.length * this.heatPerShot;
        }
        const intercepts = this.getSystem().handlers.getUsedIntercepts();
        if (intercepts > 0) {
            return previousResponse + intercepts * this.heatPerShot;
        }
    }
}
export default FireOrderHeatStrategy;
