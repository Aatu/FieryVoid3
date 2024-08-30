import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import UiStrategy from "./UiStrategy";
import Ship from "@fieryvoid3/model/src/unit/Ship";

class SystemClickShowsSystemMenu extends UiStrategy {
  private clickedSystem: ShipSystem | null = null;
  private element: HTMLElement | null = null;
  private clickedShip: Ship | null = null;

  shipStateChanged() {
    const { uiState } = this.getServices();
    if (this.clickedSystem && this.element) {
      uiState.setSystemMenuActiveSystem(
        this.clickedSystem.getShip(),
        this.clickedSystem,
        this.element
      );
    }
  }

  closeSystemInfo() {
    this.hide();
  }

  deactivate() {
    const { uiState } = this.getServices();
    if (this.clickedShip) {
      uiState.setSystemMenuActiveSystem(null, null, null);
    }
  }

  systemClicked({
    ship,
    system,
    element,
    scs = false,
  }: {
    ship: Ship;
    system: ShipSystem;
    element: HTMLElement;
    scs?: boolean;
  }) {
    const { uiState } = this.getServices();

    if (!scs) {
      return;
    }

    if (this.clickedSystem === system) {
      this.hide();
      return;
    }

    this.clickedSystem = system;
    this.element = element;
    uiState.setSystemMenuActiveSystem(ship, this.clickedSystem, this.element);
  }

  hexClicked() {
    this.hide();
  }

  mouseOverShip() {
    this.hide();
  }

  mouseOutShip() {
    this.hide();
  }

  hide() {
    if (!this.clickedSystem) {
      return;
    }

    const { uiState } = this.getServices();
    uiState.setSystemMenuActiveSystem(null, null, null);
    this.clickedSystem = null;
    this.element = null;
  }
}

export default SystemClickShowsSystemMenu;
