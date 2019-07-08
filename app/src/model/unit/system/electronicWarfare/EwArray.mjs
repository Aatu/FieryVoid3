import ShipSystem from "../ShipSystem.mjs";
import { ElectronicWarfareProvider } from "../strategy";

class EwArray extends ShipSystem {
  constructor(args, output) {
    super(args, [new ElectronicWarfareProvider(output)]);
  }

  getDisplayName() {
    return "Electronic Warfare array";
  }

  getBackgroundImage() {
    return "/img/system/scanner.png";
  }

  getIconText() {
    return this.callHandler("getUsageVsOutputText");
  }
}

export default EwArray;
