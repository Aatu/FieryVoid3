import PhaseStrategy from "./PhaseStrategy";
import {
  ShowShipObjects,
  RightClickShowsShipWindow,
  MouseOverHighlightsShip,
  MouseOverShowsShipTooltip,
  HighlightSelectedShip,
  SelectedShipMovementUi,
  SelectFirstActiveShip,
  AllShipsMovementPaths,
  AllowSubmittingOnValidGameState,
  ReplayShipMovement,
  AutomaticReplay
} from "../../ui/uiStrategy";

class AutomaticReplayPhaseStrategy extends PhaseStrategy {
  constructor(services) {
    super(services);
    this.strategies = [
      new ReplayShipMovement(),
      new AutomaticReplay(this, 5000)
    ];
  }

  canDisturb() {
    return false;
  }

  update(gamedata) {
    this.updateStrategies(gamedata);
    return this;
  }
}

export default AutomaticReplayPhaseStrategy;
