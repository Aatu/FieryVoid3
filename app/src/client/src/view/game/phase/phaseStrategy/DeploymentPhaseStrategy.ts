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
  SelectedShipDeploymentMovementUi,
  ShipClickSelectsShip,
} from "../../ui/uiStrategy";
import { Services } from "../PhaseDirector";
import GameConnector from "../../GameConnector";

class DeploymentPhaseStrategy extends PhaseStrategy {
  constructor(services: Services) {
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
      new SelectedShipDeploymentMovementUi(),
    ];
  }

  commitTurn(gameConnector: GameConnector) {
    gameConnector.commitDeployment(this.getGameData());
  }
}

export default DeploymentPhaseStrategy;
