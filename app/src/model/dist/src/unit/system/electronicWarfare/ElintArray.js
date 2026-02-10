import { EW_TYPE } from "../../../electronicWarfare/electronicWarfareTypes";
import EwArray from "./EwArray";
class ElintArray extends EwArray {
    constructor(args, output) {
        super(args, output, [
            EW_TYPE.OFFENSIVE_SUPPORT,
            EW_TYPE.DEFENSIVE_SUPPORT,
            EW_TYPE.DISRUPTION,
            EW_TYPE.AREA_DEFENSIVE_SUPPORT,
        ]);
    }
    getDisplayName() {
        return "ELINT array";
    }
    getBackgroundImage() {
        return "/img/system/scanner.png";
    }
}
export default ElintArray;
