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
  GameShipTooltipMenuStrategy
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
      new AllShipsMovementPaths(),
      new AllowSubmittingOnValidGameState(),
      new GameShipTooltipMenuStrategy()
    ];
  }

  commitTurn(gameConnector) {
    gameConnector.commitTurn(this.gameData);
  }
}

export default GamePhaseStrategy;
