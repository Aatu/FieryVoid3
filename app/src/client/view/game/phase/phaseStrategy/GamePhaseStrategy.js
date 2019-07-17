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
  GameShipTooltipMenuStrategy,
  ShowUiModeButtons,
  OwnedShipEw,
  MouseOverShowsMovementPath,
  MouseOverShowsElectronicWarfare,
  ShipClickSelectsShip
} from "../../ui/uiStrategy";

class GamePhaseStrategy extends PhaseStrategy {
  constructor(services) {
    super(services);

    this.strategies = [
      new ShipClickSelectsShip(),
      //new RightClickShowsShipWindow(),
      new MouseOverHighlightsShip(),
      new ShowShipObjects(),
      new MouseOverShowsShipTooltip(),
      new SelectFirstActiveShip(),
      new HighlightSelectedShip(),
      new SelectedShipMovementUi(),
      //new MouseOverShowsMovementPath(),
      new AllShipsMovementPaths(),
      new AllowSubmittingOnValidGameState(),
      new GameShipTooltipMenuStrategy(),
      new ShowUiModeButtons(),
      //new MouseOverShowsElectronicWarfare(),
      new OwnedShipEw()
    ];
  }

  commitTurn(gameConnector) {
    gameConnector.commitTurn(this.gameData);
  }
}

export default GamePhaseStrategy;
