import ShipSystem from "../ShipSystem.mjs";
import * as ewTypes from "../../../electronicWarfare/electronicWarfareTypes.mjs";
import { ElectronicWarfareProvider } from "../strategy";

/*
export const EW_OFFENSIVE = "oew";
export const EW_DEFENSIVE = "dew";
export const EW_TRACKING = "cqew";
export const EW_OFFENSIVE_SUPPORT = "soew";
export const EW_DEFENSIVE_SUPPORT = "sdew";
export const EW_DISRUPTION = "disew";
export const EW_AREA_DEFENSIVE_SUPPORT = "adew";
*/

class CQEWArray extends ShipSystem {
  constructor(args, output) {
    super(args, [new ElectronicWarfareProvider(output, [ewTypes.EW_TRACKING])]);
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
