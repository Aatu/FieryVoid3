import UiStrategy from "../UiStrategy";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import Ship from "@fieryvoid3/model/src/unit/Ship";

class SelectWeaponOnSystemClick extends UiStrategy {
  deactivate() {
    const { uiState } = this.getServices();

    uiState.deselectAllSystems();
  }

  systemClicked({
    ship,
    system,
    scs,
  }: {
    ship: Ship;
    system: ShipSystem;
    scs: boolean;
  }) {
    const { uiState, currentUser } = this.getServices();

    if (scs || !system.isWeapon() || !ship.player.is(currentUser)) {
      return;
    }

    if (uiState.isSelectedSystem(system)) {
      uiState.deselectSystem(system);
    } else {
      uiState.selectSystem(ship, system);
    }

    uiState.updateState();
  }
}

export default SelectWeaponOnSystemClick;
