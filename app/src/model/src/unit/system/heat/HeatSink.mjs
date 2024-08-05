import ShipSystem from "../ShipSystem.mjs";
import StoreHeatStrategy from "../strategy/StoreHeatStrategy.mjs";

class HeatSink extends ShipSystem {
  constructor(args, heatStorage) {
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
