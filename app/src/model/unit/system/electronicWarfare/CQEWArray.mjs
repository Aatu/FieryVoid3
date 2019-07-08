import ShipSystem from "../ShipSystem.mjs";
import * as ewTypes from "../../../electronicWarfare/electronicWarfareTypes.mjs";
import { ElectronicWarfareProvider } from "../strategy";

class CQEWArray extends ShipSystem {
  constructor(args, output) {
    super(args, [new ElectronicWarfareProvider(output, [ewTypes.EW_CC])]);
  }

  getDisplayName() {
    return "CQEW array";
  }

  getBackgroundImage() {
    return "/img/system/scanner.png";
  }

  getIconText() {
    return this.callHandler("getUsageVsOutputText");
  }
}

export default CQEWArray;
