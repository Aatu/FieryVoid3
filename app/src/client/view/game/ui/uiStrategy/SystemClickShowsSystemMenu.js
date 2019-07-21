import UiStrategy from "./UiStrategy";

class SystemClickShowsSystemMenu extends UiStrategy {
  constructor() {
    super();

    this.clickedSystem = null;
  }

  shipStateChanged() {
    const { uiState } = this.services;
    if (this.clickedSystem) {
      uiState.setSystemMenuActiveSystem(this.clickedSystem, this.element);
    }
  }

  closeSystemInfo() {
    this.hide();
  }

  deactivate() {
    const { uiState } = this.services;
    if (this.clickedShip) {
      uiState.setSystemMenuActiveSystem(null, null);
    }
  }

  systemClicked({ system, element, scs }) {
    const { uiState } = this.services;

    if (!scs) {
      return;
    }

    this.clickedSystem = system;
    this.element = element;
    uiState.setSystemMenuActiveSystem(this.clickedSystem, this.element);
  }

  hexClicked() {
    this.hide();
  }

  mouseOverShip(payload) {
    this.hide();
  }

  mouseOutShip() {
    this.hide();
  }

  hide() {
    if (!this.clickedSystem) {
      return;
    }

    const { uiState } = this.services;
    uiState.setSystemMenuActiveSystem(null, null);
    this.clickedSystem = null;
    this.element = null;
  }
}

export default SystemClickShowsSystemMenu;
