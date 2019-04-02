class UIState {
  constructor() {
    this.state = {
      shipWindows: {},
      weaponList: null,
      systemInfo: null,
      systemInfoMenu: null,
      movementUi: null
    };
  }

  getState() {
    return this.state;
  }

  setShipWindows(args) {
    this.state.shipWindows = args;
  }

  showWeaponList(args) {
    this.state.weaponList = args;
  }

  hideWeaponList() {
    this.state.weaponList = null;
  }

  showSystemInfo(args) {
    this.state.systemInfo = args;
  }

  hideSystemInfo() {
    this.state.systemInfo = null;
  }

  showSystemInfoMenu(args) {
    this.state.systemInfoMenu = args;
  }

  hideSystemInfoMenu() {
    this.state.systemInfoMenu = null;
  }

  showMovementUi(args) {
    this.state.movementUi = args;
  }

  hideMovementUi() {
    this.state.movementUi = null;
  }

  repositionMovementUi(position) {
    console.error("Moving of movement UI is not supported");
  }
}

export default UIState;
