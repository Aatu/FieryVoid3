import ShipSystem from "../ShipSystem.mjs";

class HeatSink extends ShipSystem {
  constructor(args) {
    super(args, []);
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
