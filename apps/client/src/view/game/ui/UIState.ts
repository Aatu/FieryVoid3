import GameData from "@fieryvoid3/model/src/game/GameData";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import PhaseDirector from "../phase/PhaseDirector";
import { GameUIMode } from "./gameUiModes";
import { GAME_PHASE } from "@fieryvoid3/model/src/game/gamePhase";
import { MovementService } from "@fieryvoid3/model/src/movement";
import ShipObject from "../renderer/ships/ShipObject";
import ElectronicWarfareEntry from "@fieryvoid3/model/src/electronicWarfare/ElectronicWarfareEntry";
import ReplayContext from "../phase/phaseStrategy/AutomaticReplayPhaseStrategy/ReplayContext";
import CombatLogTorpedoAttack from "@fieryvoid3/model/src/combatLog/CombatLogTorpedoAttack";
import CombatLogWeaponFire from "@fieryvoid3/model/src/combatLog/CombatLogWeaponFire";
import { PhaseEventPayload } from "../phase/phaseStrategy/PhaseStrategy";
import { TOOLTIP_TAB } from "./shipTooltip/ShipTooltip";

export type TooltipComponentProvider = () => React.FC<{
  uiState: UIState;
  ship: Ship;
  system?: ShipSystem;
}>;

export type SystemMenuUiState = {
  shipId: string | null;
  systemInfoMenuProvider: TooltipComponentProvider | null;
  activeSystemId: number | null;
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

type Subscriptions = {
  render: (() => void)[];
  system: ((ship: Ship, shipSystem: ShipSystem) => void)[];
  ship: ((ship: Ship) => void)[];
  gamedataInstance: ((gameData: GameData) => void)[];
};

export const defaultState: State = {
  lobby: false,
  selectedShipId: null,
  selectedSystemIds: [],
  shipMovement: null,
  shipTooltip: [],
  turnReady: false,
  shipTooltipMenuProvider: null,
  systemMenu: {
    shipId: null,
    systemInfoMenuProvider: null,
    activeSystemId: null,
    activeSystemElement: null,
  },
  shipBadges: [],
  gameUiMode: {
    [GameUIMode.EW]: false,
    [GameUIMode.ENEMY_WEAPONS]: false,
    [GameUIMode.WEAPONS]: false,
    [GameUIMode.MOVEMENT]: false,
  },
  gameUiModeButtons: false,
  replayUi: null,
  combatLog: null,
  systemList: [],
  ewList: [],
  stateVersion: 0,
  waiting: false,
};

export type ShipTooltipMenuProviderProps = {
  shipId: string;
  selectTooltipTab: (tab: TOOLTIP_TAB | null) => void;
};

export type State = {
  lobby: boolean;
  selectedShipId: string | null;
  selectedSystemIds: number[];
  //systemInfo: any;
  //systemInfoMenu: any;
  shipMovement: null | ShipMovementUIState;
  shipTooltip: ShipTooltipUIState[];
  turnReady: boolean;
  waiting: boolean;
  shipTooltipMenuProvider:
    | (() => React.FC<ShipTooltipMenuProviderProps>)
    | null;
  systemMenu: SystemMenuUiState;
  shipBadges: ShipBadgeUIState[];
  gameUiMode: { [key in GameUIMode]: boolean };
  gameUiModeButtons: boolean;
  replayUi: ReplayContext | null;
  combatLog: {
    gameData: GameData;
    replayContext: ReplayContext;
    log: (CombatLogWeaponFire | CombatLogTorpedoAttack)[];
  } | null;
  systemList: ShipSystem[];
  ewList: ElectronicWarfareEntry[];
  stateVersion: number;
};

class UIState {
  private state: State;
  public dispatch: ((state: State) => void) | null = null;
  public phaseDirector: PhaseDirector | null;
  private subscriptions: Subscriptions = {
    render: [],
    system: [],
    ship: [],
    gamedataInstance: [],
  };

  public gameData: GameData;

  constructor(gameId: number) {
    this.gameData = new GameData({ id: gameId, players: [], ships: [] });
    this.phaseDirector = null;

    this.state = defaultState;
  }

  getPhaseDirector() {
    if (!this.phaseDirector) {
      throw new Error("No phase director set");
    }

    return this.phaseDirector;
  }

  getGameData() {
    if (!this.gameData) {
      throw new Error("No game data set");
    }

    return this.gameData;
  }

  getServices() {
    if (!this.phaseDirector) {
      throw new Error("No services set");
    }

    return this.phaseDirector.getServices();
  }

  getState(): State {
    return this.state as State;
  }

  setDispatch(dispatch: (state: State) => void) {
    this.dispatch = dispatch;
  }

  showShipBadge(icon: ShipObject, showName: boolean = true) {
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

  setEwList(entries: ElectronicWarfareEntry[]) {
    this.state.ewList = entries;
  }

  setSystemList(systems: ShipSystem[]) {
    this.state.systemList = systems;
    this.updateState();
  }

  isSelectedSystem(system: ShipSystem) {
    return this.getState().selectedSystemIds.includes(system.id);
  }

  selectSystem(ship: Ship, systems: ShipSystem | ShipSystem[]) {
    if (this.getSelectedShip() !== ship) {
      this.selectShip(ship);
    }

    const systemIds = this.getState().selectedSystemIds;

    ([] as ShipSystem[]).concat(systems).forEach((system) => {
      if (!systemIds.includes(system.id)) {
        systemIds.push(system.id);
      }
    });

    this.state.selectedSystemIds = systemIds;

    this.updateState();
    this.customEvent("systemSelected", { systems });
  }

  deselectSystem(systems: ShipSystem | ShipSystem[]) {
    systems = ([] as ShipSystem[]).concat(systems);

    this.state.selectedSystemIds = this.getState().selectedSystemIds.filter(
      (id) => systems.every((system) => system.id !== id)
    );
    this.updateState();
    this.customEvent("systemDeselected", { systems });
  }

  deselectAllSystems() {
    const systems = this.getSelectedSystems();
    this.state.selectedSystemIds = [];
    this.updateState();
    this.customEvent("systemDeselected", { systems });
  }

  getSelectedSystems() {
    const ship = this.getSelectedShip();
    if (!ship) {
      return [];
    }

    return this.state.selectedSystemIds.map((id) =>
      ship.systems.getSystemById(id)
    );
  }

  hasGameUiMode(values: GameUIMode | GameUIMode[]) {
    values = ([] as GameUIMode[]).concat(values);
    return values.some((value) => this.getState().gameUiMode[value]);
  }

  toggleGameUiMode(value: GameUIMode) {
    this.getState().gameUiMode[value] = !this.getState().gameUiMode[value];
    this.updateState();
  }

  showUiModeButtons(value: boolean) {
    this.getState().gameUiModeButtons = value;
    this.updateState();
  }

  showReplayUi(value: ReplayContext | null) {
    this.getState().replayUi = value;
    this.updateState();
  }

  startCombatLog(replayContext: ReplayContext, gameData: GameData) {
    this.getState().combatLog = {
      gameData,
      replayContext,
      log: [],
    };
  }

  addToCombatLog(value: CombatLogWeaponFire | CombatLogTorpedoAttack) {
    const state = this.getState();

    if (!state.combatLog) {
      throw new Error("Start combat log first");
    }

    state.combatLog.log.push(value);
    this.updateState();
  }

  hideCombatLog() {
    this.getState().combatLog = null;
    this.updateState();
  }

  startReplay() {
    this.getPhaseDirector().startReplay();
    this.updateState();
  }

  closeReplay() {
    this.getPhaseDirector().closeReplay();
    this.updateState();
  }

  isReplay(): boolean {
    return Boolean(this.getState().replayUi);
  }

  setTurnReady(ready: boolean) {
    this.state.turnReady = ready;
    this.updateState();
  }

  setWaiting(waiting: boolean) {
    this.state.waiting = waiting;
    this.updateState();
  }

  setPhaseDirector(phaseDirector: PhaseDirector) {
    this.phaseDirector = phaseDirector;
  }

  customEvent(name: string, payload?: PhaseEventPayload) {
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

  selectShip(ship: Ship) {
    if (this.getSelectedShip() === ship) {
      return;
    }

    this.deselectShip();
    this.state.selectedShipId = ship.id;
    this.updateState();
    this.customEvent("shipSelected", { ship });
  }

  deselectShip() {
    const ship = this.getSelectedShip();
    this.state.selectedShipId = null;
    this.updateState();
    this.deselectAllSystems();
    if (ship) {
      this.customEvent("shipDeselected", { ship });
    }
  }

  getSelectedShip() {
    if (!this.state.selectedShipId) {
      return null;
    }

    return this.gameData.ships.getShipById(this.state.selectedShipId);
  }

  isSelected(ship: Ship) {
    return this.state.selectedShipId === ship.id;
  }

  updateState() {
    //this.state.stateVersion++;

    if (!this.dispatch) {
      return;
    }

    this.dispatch(cloneState(this.getState()));
    this.customEvent("uiStateChanged");
  }

  setTooltipMenuProvider(
    callBack: null | (() => React.FC<ShipTooltipMenuProviderProps>)
  ) {
    this.state.shipTooltipMenuProvider = callBack;
    this.updateState();
  }

  setSystemInfoMenuProvider(callBack: null | TooltipComponentProvider) {
    this.getState().systemMenu.systemInfoMenuProvider = callBack;
    this.updateState();
  }

  setSystemMenuActiveSystem(
    ship: Ship | null,
    system: ShipSystem | null,
    element: HTMLElement | null
  ) {
    this.state.systemMenu.shipId = ship?.id || null;
    this.state.systemMenu.activeSystemId = system?.id || null;
    this.state.systemMenu.activeSystemElement = element;
    this.updateState();
  }

  update(gameData: GameData) {
    this.gameData = gameData;
  }

  gameDataUpdated() {
    this.subscriptions.gamedataInstance.forEach((callBack) =>
      callBack(this.getGameData())
    );
  }

  setLobby(status: boolean) {
    this.state.lobby = status;
    this.updateState();
  }

  /*  showSystemInfo(args) {
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
    */

  shipStateChanged(ship: Ship) {
    this.customEvent("shipStateChanged", { ship });
  }

  shipSystemStateChanged(ship: Ship, system: ShipSystem) {
    this.customEvent("shipSystemStateChanged", { ship, system });
    this.subscriptions.system.forEach((callBack) => callBack(ship, system));
  }

  showShipTooltip(ship: Ship, ui: boolean = false, right: boolean = false) {
    this.hideShipTooltip(ship);
    this.getState().shipTooltip.push({
      ship,
      ui,
      right: !right,
    });
    this.updateState();
  }

  hideShipTooltip(ship: Ship) {
    this.state.shipTooltip = this.getState().shipTooltip.filter(
      (tooltip) => tooltip.ship.id !== ship.id
    );

    this.customEvent("shipTooltipHidden", { ship });
    this.updateState();
  }

  hideAllShipTooltips() {
    this.getState().shipTooltip.forEach(({ ship }) => {
      this.customEvent("shipTooltipHidden", { ship });
    });

    this.state.shipTooltip = [];
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
    this.subscriptions.render.forEach((listener) => listener());
  }

  subscribeToRender(callBack: () => void) {
    this.subscriptions.render.push(callBack);
  }

  unsubscribeFromRender(callBack: () => void) {
    this.subscriptions.render = this.subscriptions.render.filter(
      (listener) => listener !== callBack
    );
  }

  subscribeToSystemChange(
    callBack: (ship: Ship, shipSystem: ShipSystem) => void
  ) {
    this.subscriptions.system.push(callBack);
  }

  unsubscribeFromSystemChange(
    callBack: (ship: Ship, shipSystem: ShipSystem) => void
  ) {
    this.subscriptions.system = this.subscriptions.system.filter(
      (listener) => listener !== callBack
    );
  }

  subscribeToGameDataInstance(callBack: (gameData: GameData) => void) {
    this.subscriptions.gamedataInstance.push(callBack);
  }

  unsubscribeFromGameDataInstance(callBack: (gameData: GameData) => void) {
    this.subscriptions.gamedataInstance =
      this.subscriptions.gamedataInstance.filter(
        (listener) => listener !== callBack
      );
  }
}

export default UIState;

const cloneState = (state: State): State => {
  return {
    ...state,
    selectedSystemIds: [...state.selectedSystemIds],
    shipTooltip: [...state.shipTooltip],
    shipBadges: [...state.shipBadges],
    ewList: [...state.ewList],
    systemList: [...state.systemList],
  };
};
