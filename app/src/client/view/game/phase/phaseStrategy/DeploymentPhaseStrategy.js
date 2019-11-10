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
  ShipClickSelectsShip
} from "../../ui/uiStrategy";

class DeploymentPhaseStrategy extends PhaseStrategy {
  constructor(services) {
    super(services);

    this.strategies = [
      new ShipClickSelectsShip(),
      new RightClickShowsShipWindow(),
      new ShowDeploymentAreas(),
      new MouseOverHighlightsShip(),
      new MouseOverShowsMovementPath(),
      new ShowShipObjects(),
      new MouseOverShowsShipTooltip(),
      new SelectUndeployedShip(),
      new HighlightSelectedShip(),
      new DeployShipOnHexClick(),
      new AllowSubmittingWhenDeploymentDone(),
      //new SelectedShipNavigationPath(),
      new SelectedShipDeploymentMovementUi()
    ];
  }

  commitTurn(gameConnector) {
    gameConnector.commitDeployment(this.gameData);
  }
}

export default DeploymentPhaseStrategy;
