import PhaseStrategy from "./PhaseStrategy";

import {
  ShowShipObjects,
  RightClickShowsShipWindow,
  MouseOverHighlightsShip,
  MouseOverShowsMovementPath,
  MouseOverShowsShipTooltip,
  ShowWaitingStatus,
  SystemClickShowsSystemMenu,
  WeaponArcsOnSystemMouseOver,
  UnderHexForShips,
} from "../../ui/uiStrategy";

class WaitingPhaseStrategy extends PhaseStrategy {
  constructor(services) {
    super(services);

    this.strategies = [
      new ShowWaitingStatus(),
      new RightClickShowsShipWindow(),
      new MouseOverHighlightsShip(),
      new MouseOverShowsMovementPath(),
      new ShowShipObjects(),
      new MouseOverShowsShipTooltip(),
      new SystemClickShowsSystemMenu(),
      new WeaponArcsOnSystemMouseOver(),
      new UnderHexForShips(),
    ];
  }
}

export default WaitingPhaseStrategy;
