import PhaseStrategy from "./PhaseStrategy";
import {
  ShowShipObjects,
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
  ShipClickSelectsShip,
  CurrentEW,
  WeaponArcsOnSystemMouseOver,
  SelectWeaponOnSystemClick,
  SelectedShipSystemList,
  GameSystemInfoMenuStrategy,
  SystemClickShowsSystemMenu,
  SelectedShipEwList,
  UnderHexForShips,
  ShowMapIcons,
  ShowShipBadges,
  ShowTorpedoObjects,
  WeaponTargetingMouseoverShowsLine,
  ShowShipDEWandCCEW,
} from "../../ui/uiStrategy";
import GameConnector from "../../GameConnector";
import { Services } from "../PhaseDirector";

class GamePhaseStrategy extends PhaseStrategy {
  constructor(services: Services) {
    super(services);

    this.strategies = [
      new WeaponTargetingMouseoverShowsLine(),
      new ShipClickSelectsShip(),
      new MouseOverHighlightsShip(),
      new ShowShipObjects(),
      new MouseOverShowsShipTooltip(),
      new SelectFirstActiveShip(),
      new HighlightSelectedShip(),
      new SelectedShipMovementUi(),
      new AllShipsMovementPaths(),
      new AllowSubmittingOnValidGameState(),
      new GameShipTooltipMenuStrategy(),
      new ShowUiModeButtons(),
      new OwnedShipEw(),
      new CurrentEW(),
      new WeaponArcsOnSystemMouseOver(),
      new SelectWeaponOnSystemClick(),
      new SelectedShipSystemList(),
      new GameSystemInfoMenuStrategy(),
      new SystemClickShowsSystemMenu(),
      new SelectedShipEwList(),
      new UnderHexForShips(),
      new ShowMapIcons(),
      new ShowShipBadges(),
      new ShowTorpedoObjects(),
      new ShowShipDEWandCCEW(),
    ];
  }

  commitTurn(gameConnector: GameConnector) {
    gameConnector.commitTurn(this.getGameData());
  }
}

export default GamePhaseStrategy;
