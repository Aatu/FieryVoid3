import ShipWindowManager from "../ui/shipWindow/ShipWindowManager";
import * as gameUiModes from "./gameUiModes";

class UIState {
  constructor() {
    this.phaseDirector = null;
    this.services = null;
    this.shipWindowManager = null;

    this.renderListeners = [];

    this.state = {
      replay: false,
      lobby: false,
      gameData: null,
      selectedShip: null,
      shipWindows: null,
      weaponList: null,
      systemInfo: null,
      systemInfoMenu: null,
      shipMovement: null,
      shipTooltip: [],
      turnReady: false,
      shipTooltipMenuProvider: null,
      gameUiMode: {},
      gameUiModeButtons: false
    };

    this.state.gameUiMode[gameUiModes.EW] = false;
    this.state.gameUiMode[gameUiModes.WEAPONS] = false;
    this.state.gameUiMode[gameUiModes.MOVEMENT] = false;

    this.updateState();
  }

  hasGameUiMode(value) {
    return this.state.gameUiMode[value];
  }

  toggleGameUiMode(value) {
    this.state.gameUiMode[value] = !this.state.gameUiMode[value];
    this.updateState();
  }

  showUiModeButtons(value) {
    this.state.gameUiModeButtons = value;
    this.updateState();
  }

  closeReplay() {
    this.state.replay = false;
    this.phaseDirector.closeReplay();
    this.updateState();
  }

  isReplay() {
    return this.state.replay;
  }

  init(setState) {
    this.setState = setState;
    this.updateState();
  }

  setTurnReady(ready) {
    this.state.turnReady = ready;
    this.updateState();
  }

  setWaiting(waiting) {
    this.state.waiting = waiting;
    this.updateState();
  }

  setPhaseDirector(phaseDirector) {
    this.phaseDirector = phaseDirector;
    this.shipWindowManager = new ShipWindowManager(
      this,
      phaseDirector.movementService
    );
    this.services = phaseDirector.getServices();
  }

  customEvent(name, payload) {
    this.phaseDirector.relayEvent(name, payload);
  }

  commitTurn() {
    this.phaseDirector.commitTurn();
  }

  selectShip(ship) {
    this.deselectShip();
    this.state.selectedShip = ship;
    this.updateState();
    this.customEvent("shipSelected", ship);
  }

  deselectShip() {
    const ship = this.state.selectedShip;
    this.state.selectedShip = null;
    this.updateState();
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
    if (!this.setState) {
      return;
    }

    this.setState({ uiState: this });
    this.customEvent("uiStateChanged");
  }

  setTooltipMenuProvider(callBack) {
    this.state.shipTooltipMenuProvider = callBack;
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

  openShipWindow(ship) {
    this.shipWindowManager.open(ship);
  }

  closeShipWindow(ship) {
    this.shipWindowManager.close(ship);
  }

  closeShipWindows() {
    this.shipWindowManager.closeAll();
  }

  getState() {
    return this.state;
  }

  setShipWindows(args) {
    this.state.shipWindows = args;
    this.updateState();
  }

  showWeaponList(args) {
    this.state.weaponList = args;
    this.updateState();
  }

  hideWeaponList() {
    this.state.weaponList = null;
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

  isSelectedSystem(system) {
    //TODO: implement
    return false;
  }

  showShipTooltip(icon, ui = false) {
    const { coordinateConverter } = this.services;
    const ship = icon.ship;

    this.hideShipTooltip(ship);
    this.state.shipTooltip.push({
      ship,
      getPosition: () =>
        coordinateConverter.fromGameToViewPort(icon.getPosition()),
      ui
    });
    this.updateState();
  }

  hideShipTooltip(ship) {
    this.state.shipTooltip = this.state.shipTooltip.filter(
      tooltip => tooltip.ship.id !== ship.id
    );
    this.updateState();
  }

  showShipDeploymentMovement(ship) {
    const {
      shipIconContainer,
      coordinateConverter,
      movementService
    } = this.services;

    this.state.shipMovement = {
      ship,
      type: "deploy",
      movementService,
      getPosition: () =>
        coordinateConverter.fromGameToViewPort(
          shipIconContainer.getByShip(ship).getPosition()
        )
    };
    this.updateState();
  }

  showShipMovement(ship) {
    const {
      shipIconContainer,
      coordinateConverter,
      movementService
    } = this.services;

    this.state.shipMovement = {
      ship,
      type: "game",
      movementService,
      getPosition: () =>
        coordinateConverter.fromGameToViewPort(
          shipIconContainer.getByShip(ship).getPosition()
        )
    };
    this.updateState();
  }

  hideShipMovement() {
    this.state.shipMovement = null;
    this.updateState();
  }

  render() {
    this.renderListeners.forEach(listener => listener());
  }

  subscribeToRender(callBack) {
    this.renderListeners.push(callBack);
  }

  unsubscribeFromRender(callBack) {
    this.renderListeners = this.renderListeners.filter(
      listener => listener !== callBack
    );
  }
}

export default UIState;
