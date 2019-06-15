import PhaseStrategy from "./PhaseStrategy";

import {
  ShowDeploymentAreas,
  ShowShipObjects,
  RightClickShowsShipWindow,
  MouseOverHighlightsShip,
  MouseOverShowsMovementPath,
  MouseOverShowsShipTooltip,
  SelectUndeployedShip,
  HighlightSelectedShip,
  DeployShipOnHexClick,
  AllowSubmittingWhenDeploymentDone,
  DebugDrawLineFromSelectedShip,
  SelectedShipNavigationPath,
  SelectedShipDeploymentMovementUi,
  ShowWaitingStatus
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
      new MouseOverShowsShipTooltip()
    ];
  }
}

export default WaitingPhaseStrategy;
