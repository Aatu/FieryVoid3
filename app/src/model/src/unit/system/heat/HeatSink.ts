import ShipSystem, { SystemArgs } from "../ShipSystem";
import StoreHeatStrategy from "../strategy/StoreHeatStrategy";

class HeatSink extends ShipSystem {
  constructor(args: SystemArgs, heatStorage: number) {
    super(args, [new StoreHeatStrategy(heatStorage)]);
  }

  getDisplayName() {
    return "Heat sink";
  }

  getBackgroundImage() {
    return "/img/system/heatSink.png";
  }

  getIconText() {
    return "";
  }
}

export default HeatSink;
