import EwArray from "./EwArray";
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
