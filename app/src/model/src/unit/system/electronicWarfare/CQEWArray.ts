import { EW_TYPE } from "../../../electronicWarfare/electronicWarfareTypes";
import ShipSystem, { SystemArgs } from "../ShipSystem";
import ElectronicWarfareProvider from "../strategy/ElectronicWarfareProvider";
import { SYSTEM_HANDLERS } from "../strategy/types/SystemHandlersTypes";

class CQEWArray extends ShipSystem {
  constructor(args: SystemArgs, output: number) {
    super(args, [new ElectronicWarfareProvider(output, [EW_TYPE.CC])]);
  }

  getDisplayName() {
    return "CQEW array";
  }

  getBackgroundImage() {
    return "/img/system/scanner.png";
  }

  getIconText() {
    return this.callHandler(SYSTEM_HANDLERS.getUsageVsOutputText, null, "");
  }
}

export default CQEWArray;
