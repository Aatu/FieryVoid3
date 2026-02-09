import ShipSystem from "../ShipSystem";
import { BoostableSystemStrategy, ThrustOutputSystemStrategy, RequiresPowerSystemStrategy, } from "../strategy/index";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";
class Engine extends ShipSystem {
    constructor(args, output, power, boostPower) {
        super(args, [
            new BoostableSystemStrategy(boostPower),
            new ThrustOutputSystemStrategy(output),
            new RequiresPowerSystemStrategy(power),
        ]);
    }
    getDisplayName() {
        return "Engine";
    }
    getBackgroundImage() {
        return "/img/system/engine.png";
    }
    getIconText() {
        return this.callHandler(SYSTEM_HANDLERS.getThrustOutput, undefined, "");
    }
}
export default Engine;
