import EwArray from "./EwArray.mjs";
import * as ewTypes from "../../../electronicWarfare/electronicWarfareTypes.mjs";
import { ElectronicWarfareProvider } from "../strategy/index.mjs";

class ElintArray extends EwArray {
  constructor(args, output) {
    super(args, [
      new ElectronicWarfareProvider(output, [
        ewTypes.EW_OFFENSIVE_SUPPORT,
        ewTypes.EW_DEFENSIVE_SUPPORT,
        ewTypes.EW_DISRUPTION,
        ewTypes.EW_AREA_DEFENSIVE_SUPPORT
      ])
    ]);
  }

  getDisplayName() {
    return "ELINT array";
  }

  getBackgroundImage() {
    return "/img/system/scanner.png";
  }

  getIconText() {
    return this.callHandler("getUsageVsOutputText");
  }
}

export default ElintArray;
