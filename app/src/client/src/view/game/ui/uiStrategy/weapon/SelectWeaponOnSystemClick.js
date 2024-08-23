import * as THREE from "three";
import UiStrategy from "../UiStrategy";
import {
  degreeToRadian,
  addToDirection,
  getArcLength,
} from "../../../../../../model/utils/math";

const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color("rgb(20,80,128)"),
  opacity: 0.5,
  transparent: true,
});

class SelectWeaponOnSystemClick extends UiStrategy {
  constructor() {
    super();
    this.weaponArcs = [];
  }

  deactivate() {
    const { uiState } = this.getServices();

    uiState.deselectAllSystems();
  }

  systemClicked({ ship, system, scs }) {
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
