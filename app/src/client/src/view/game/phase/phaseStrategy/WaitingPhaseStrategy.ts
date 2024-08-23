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
  ShowMapIcons,
} from "../../ui/uiStrategy";
import { Services } from "../PhaseDirector";

class WaitingPhaseStrategy extends PhaseStrategy {
  constructor(services: Services) {
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
      new ShowMapIcons(),
    ];
  }

  commitTurn(): void {}
}

export default WaitingPhaseStrategy;
