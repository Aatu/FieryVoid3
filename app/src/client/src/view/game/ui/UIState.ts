import GameData from "@fieryvoid3/model/src/game/GameData";
import * as gameUiModes from "./gameUiModes";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import PhaseDirector, { Services } from "../phase/PhaseDirector";
import { GameUIMode } from "./gameUiModes";
import { GAME_PHASE } from "@fieryvoid3/model/src/game/gamePhase";
import { MovementService } from "@fieryvoid3/model/src/movement";
import ShipObject from "../renderer/ships/ShipObject";

export type TooltipCcomponentProvider = () => React.FC<{
  uiState: UIState;
  ship: Ship;
  system: ShipSystem;
}>;

export type SystemMenuUiState = {
  systemInfoMenuProvider: TooltipCcomponentProvider | null;
  activeSystem: ShipSystem | null;
  activeSystemElement: HTMLElement | null;
};

export type ShipMovementUIState = {
  ship: Ship;
  type: GAME_PHASE;
  movementService: MovementService;
  getPosition: () => { x: number; y: number };
};

export type ShipTooltipUIState = {
  ship: Ship;
  ui: boolean;
  right: boolean;
};

export type ShipBadgeUIState = {
  icon: ShipObject;
  version: number;
  showName: boolean;
  visible: boolean;
};

type State = {
  lobby: boolean;
  gameData: GameData;
  selectedShip: Ship | null;
  selectedSystems: ShipSystem[];
  //systemInfo: any;
  //systemInfoMenu: any;
  shipMovement: null | ShipMovementUIState;
  shipTooltip: ShipTooltipUIState[];
  turnReady: boolean;
  shipTooltipMenuProvider: () => React.FC;
  systemMenu: SystemMenuUiState;
  shipBadges: ShipBadgeUIState[];
  gameUiMode: { [key in GameUIMode]: boolean };
  gameUiModeButtons: boolean;
  replayUi: boolean;
  combatLog: boolean;
  systemList: ShipSystem[];
  ewList: any[];
  stateVersion: number;
};

class UIState {
  private state: Partial<State>;
  public dispatch: any;
  public phaseDirector: PhaseDirector | null;
  public services: Services | null;
  public renderListeners: any[];
  public systemChangeListeners: any[];
  public gameData: GameData | null = null;

  constructor() {
    this.phaseDirector = null;
    this.services = null;

    this.renderListeners = [];

    this.systemChangeListeners = [];

    this.state = {
      lobby: false,
      gameData: undefined,
      selectedShip: null,
      selectedSystems: [],
      systemInfo: null,
      systemInfoMenu: null,
      shipMovement: null,
      shipTooltip: [],
      turnReady: false,
      shipTooltipMenuProvider: null,
      systemMenu: {
        systemInfoMenuProvider: null,
        activeSystem: null,
        activeSystemElement: null,
      },
      shipBadges: [],
      gameUiMode: {},
      gameUiModeButtons: false,
      replayUi: false,
      combatLog: false,
      systemList: [],
      ewList: [],
      stateVersion: 0,
    };

    this.state.gameUiMode[gameUiModes.EW] = false;
    this.state.gameUiMode[gameUiModes.ENEMY_WEAPONS] = false;
    this.state.gameUiMode[gameUiModes.WEAPONS] = false;
    this.state.gameUiMode[gameUiModes.MOVEMENT] = false;
  }

  getGameData() {
    if (!this.gameData) {
      throw new Error("No game data set");
    }

    return this.gameData;
  }

  getServices() {
    if (!this.services) {
      throw new Error("No services set");
    }

    return this.services;
  }

  getState(): State {
    return this.state as State;
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch;
  }

  getReducer() {
    return this.reducer.bind(this);
  }

  reducer(state, action) {
    this.state = {
      ...state,
      ...action,
    };

    return this.state;
  }

  showShipBadge(icon: ShipObject, showName: boolean) {
    const entry = this.getState().shipBadges.find(
      (badge) => badge.icon.ship.id === icon.ship.id
    );

    if (entry) {
      entry.icon = icon;
      entry.version++;
      entry.showName = showName;
      entry.visible = true;
    } else {
      this.getState().shipBadges.push({
        icon,
        version: 0,
        showName,
        visible: true,
      });
    }

    this.updateState();
  }

  hideShipBadge(icon: ShipObject) {
    const entry = this.getState().shipBadges.find(
      (badge) => badge.icon.ship.id === icon.ship.id
    );

    if (entry) {
      entry.visible = false;
      entry.version++;
      this.updateState();
    }
  }

  removeShipBadge(icon: ShipObject) {
    this.state.shipBadges = this.getState().shipBadges.filter(
      (entry) => entry.icon.ship.id !== icon.ship.id
    );

    this.updateState();
  }

  setEwList(entries) {
    this.state.ewList = entries;
  }

  setSystemList(systems: ShipSystem[]) {
    this.state.systemList = systems;
    this.updateState();
  }

  isSelectedSystem(system) {
    return this.state.selectedSystems.includes(system);
  }

  selectSystem(ship, systems) {
    if (this.getSelectedShip() !== ship) {
      this.selectShip(ship);
    }

    systems = []
      .concat(systems)
      .filter((system) => !this.isSelectedSystem(system))
      .forEach((system) => this.state.selectedSystems.push(system));

    this.updateState();
    this.customEvent("systemSelected", { systems });
  }

  deselectSystem(systems) {
    systems = [].concat(systems);

    this.state.selectedSystems = this.state.selectedSystems.filter((selected) =>
      systems.every((system) => system.id !== selected.id)
    );

    this.updateState();
    this.customEvent("systemDeselected", { systems });
  }

  deselectAllSystems() {
    const systems = this.state.selectedSystems;
    this.state.selectedSystems = [];
    this.updateState();
    this.customEvent("systemDeselected", { systems });
  }

  getSelectedSystems() {
    return this.state.selectedSystems;
  }

  hasGameUiMode(values) {
    values = [].concat(values);
    return values.some((value) => this.state.gameUiMode[value]);
  }

  toggleGameUiMode(value) {
    this.state.gameUiMode[value] = !this.state.gameUiMode[value];
    this.updateState();
  }

  showUiModeButtons(value) {
    this.state.gameUiModeButtons = value;
    this.updateState();
  }

  showReplayUi(value) {
    this.state.replayUi = value;
    this.updateState();
  }

  startCombatLog(replayContext, gameData) {
    this.state.combatLog = {
      gameData,
      replayContext,
      log: [],
    };
  }

  addToCombatLog(value) {
    if (this.state.combatLog === false) {
      throw new Error("Start combat log first");
    }

    this.state.combatLog.log.push(value);
    this.updateState();
  }

  hideCombatLog() {
    this.state.combatLog = false;
    this.updateState();
  }

  startReplay() {
    this.phaseDirector.startReplay();
    this.updateState();
  }

  closeReplay() {
    this.phaseDirector.closeReplay();
    this.updateState();
  }

  isReplay() {
    return this.state.replay;
  }

  update(gameData) {
    this.gameData = gameData;
    if (this.state.selectedShip) {
      this.selectShip(
        this.gameData.ships.getShipById(this.state.selectedShip.id)
      );

      this.selectSystem(
        this.getSelectedShip(),
        this.state.selectedSystems.map((system) =>
          this.getSelectedShip().systems.getSystemById(system.id)
        )
      );
    }
  }

  setTurnReady(ready) {
    this.state.turnReady = ready;
    this.updateState();
  }

  setWaiting(waiting) {
    this.state.waiting = waiting;
    this.updateState();
  }

  setPhaseDirector(phaseDirector: PhaseDirector) {
    this.phaseDirector = phaseDirector;
    this.services = phaseDirector.getServices();
  }

  customEvent(name: string, payload?: unknown) {
    if (!this.phaseDirector) {
      return;
    }

    this.phaseDirector.relayEvent(name, payload);
  }

  commitTurn() {
    if (!this.phaseDirector) {
      return;
    }

    this.phaseDirector.commitTurn();
  }

  selectShip(ship) {
    if (this.getSelectedShip() === ship) {
      return;
    }

    this.deselectShip();
    this.state.selectedShip = ship;
    this.updateState();
    this.customEvent("shipSelected", ship);
  }

  deselectShip() {
    const ship = this.state.selectedShip;
    this.state.selectedShip = null;
    this.updateState();
    this.deselectAllSystems();
    if (ship) {
      this.customEvent("shipDeselected", ship);
    }
  }

  getSelectedShip() {
    return this.state.selectedShip;
  }

  isSelected(ship) {
    return this.state.selectedShip === ship;
  }

  updateState() {
    //this.state.stateVersion++;
    this.dispatch(this.state);
    this.customEvent("uiStateChanged");
  }

  setTooltipMenuProvider(callBack) {
    this.state.shipTooltipMenuProvider = callBack;
    this.updateState();
  }

  setSystemInfoMenuProvider(callBack) {
    this.state.systemMenu.systemInfoMenuProvider = callBack;
    this.updateState();
  }

  setSystemMenuActiveSystem(system, element) {
    this.state.systemMenu.activeSystem = system;
    this.state.systemMenu.activeSystemElement = element;
    this.updateState();
  }

  setGameData(gameData) {
    this.state.gameData = gameData.serialize();
    this.updateState();
  }

  setLobby(status) {
    this.state.lobby = status;
    this.updateState();
  }

  showSystemInfo(args) {
    this.state.systemInfo = args;
    this.updateState();
  }

  hideSystemInfo() {
    this.state.systemInfo = null;
    this.updateState();
  }

  showSystemInfoMenu(args) {
    this.state.systemInfoMenu = args;
    this.updateState();
  }

  hideSystemInfoMenu() {
    this.state.systemInfoMenu = null;
    this.updateState();
  }

  shipStateChanged(ship) {
    this.customEvent("shipStateChanged", ship);
  }

  shipSystemStateChanged(ship, system) {
    this.customEvent("shipSystemStateChanged", { ship, system });
    this.systemChangeListeners.forEach((callBack) => callBack(ship, system));
  }

  showShipTooltip(ship: Ship, ui: boolean = false, right: boolean = false) {
    this.hideShipTooltip(ship);
    this.state.shipTooltip.push({
      ship,
      ui,
      right: !right,
    });
    this.updateState();
  }

  hideShipTooltip(ship) {
    this.state.shipTooltip = this.state.shipTooltip.filter(
      (tooltip) => tooltip.ship.id !== ship.id
    );

    this.customEvent("shipTooltipHidden", ship);
    this.updateState();
  }

  showShipDeploymentMovement(ship: Ship) {
    const { shipIconContainer, coordinateConverter, movementService } =
      this.getServices();

    this.state.shipMovement = {
      ship,
      type: GAME_PHASE.DEPLOYMENT,
      movementService,
      getPosition: () =>
        coordinateConverter.fromGameToViewPort(
          shipIconContainer.getByShip(ship).getPosition()
        ),
    };
    this.updateState();
  }

  showShipMovement(ship: Ship) {
    const { shipIconContainer, coordinateConverter, movementService } =
      this.getServices();

    this.state.shipMovement = {
      ship,
      type: GAME_PHASE.GAME,
      movementService,
      getPosition: () =>
        coordinateConverter.fromGameToViewPort(
          shipIconContainer.getByShip(ship).getPosition()
        ),
    };
    this.updateState();
  }

  hideShipMovement() {
    this.state.shipMovement = null;
    this.updateState();
  }

  render() {
    this.renderListeners.forEach((listener) => listener());
  }

  subscribeToRender(callBack) {
    this.renderListeners.push(callBack);
  }

  unsubscribeFromRender(callBack) {
    this.renderListeners = this.renderListeners.filter(
      (listener) => listener !== callBack
    );
  }

  subscribeToSystemChange(callBack) {
    this.systemChangeListeners.push(callBack);
  }

  unsubscribeFromSystemChange(callBack) {
    this.systemChangeListeners = this.systemChangeListeners.filter(
      (listener) => listener !== callBack
    );
  }
}

export default UIState;
