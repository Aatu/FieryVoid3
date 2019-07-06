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
  SelectedShipMovementUi,
  SelectFirstActiveShip,
  SelectedShipMovementPath,
  AllShipsMovementPaths
} from "../../ui/uiStrategy";

class GamePhaseStrategy extends PhaseStrategy {
  constructor(services) {
    super(services);

    this.strategies = [
      new RightClickShowsShipWindow(),
      new MouseOverHighlightsShip(),
      new ShowShipObjects(),
      new MouseOverShowsShipTooltip(),
      new SelectFirstActiveShip(),
      new HighlightSelectedShip(),
      new SelectedShipMovementUi(),
      new AllShipsMovementPaths()
    ];
  }
}

export default GamePhaseStrategy;
