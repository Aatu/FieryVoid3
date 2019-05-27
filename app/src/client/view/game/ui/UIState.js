import ShipWindowManager from "../ui/shipWindow/ShipWindowManager";

class UIState {
  constructor() {
    this.phaseDirector = null;
    this.shipWindowManager = null;

    this.state = {
      replay: false,
      lobby: false,
      gameData: null,
      shipWindows: null,
      weaponList: null,
      systemInfo: null,
      systemInfoMenu: null,
      movementUi: null
    };

    this.updateState();
  }

  isReplay() {
    return this.state.replay;
  }

  init(setState) {
    this.setState = setState;
    this.updateState();
  }

  setPhaseDirector(phaseDirector) {
    this.phaseDirector = phaseDirector;
    this.shipWindowManager = new ShipWindowManager(
      this,
      phaseDirector.movementService
    );
  }

  customEvent(name, payload) {
    if (!this.init) {
      return;
    }

    this.phaseDirector.relayEvent(name, payload);
  }

  updateState() {
    if (!this.setState) {
      return;
    }

    this.setState({ uiState: this });
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

  showMovementUi(args) {
    this.state.movementUi = args;
    this.updateState();
  }

  hideMovementUi() {
    this.state.movementUi = null;
    this.updateState();
  }

  isSelectedSystem(system) {
    //TODO: implement
    return false;
  }

  repositionMovementUi(position) {
    console.error("Moving of movement UI is not supported");
  }
}

export default UIState;
