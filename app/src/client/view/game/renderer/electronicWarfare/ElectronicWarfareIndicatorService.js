import * as THREE from "three";
import ShipEWIndicators from "./ShipEWIndicators";

const COLOR_OEW_DIST = new THREE.Color(255 / 255, 157 / 255, 0 / 255);
const COLOR_SDEW = new THREE.Color(109 / 255, 189 / 255, 255 / 255);
const COLOR_OEW_SOEW = new THREE.Color(1, 1, 1);

class ElectronicWarfareIndicatorService {
  constructor(scene, iconContainer, currentUser) {
    this.scene = scene;
    this.shipIconContainer = iconContainer;
    this.currentUser = currentUser;

    this.indicators = [];
  }

  getIndicators(ship) {
    let indicator = this.indicators.find(indicator => indicator.isShip(ship));

    if (!indicator) {
      indicator = new ShipEWIndicators(
        ship,
        this.shipIconContainer,
        this.currentUser,
        this.scene
      );

      this.indicators.push(indicator);
    }

    return indicator;
  }

  showForShip(ship) {
    this.getIndicators(ship)
      .update(ship)
      .show();
  }

  hideForShip(ship) {
    this.getIndicators(ship)
      .update(ship)
      .hide();
  }

  hideAll() {
    this.indicators.forEach(indicators => indicators.hide());
  }
}

export default ElectronicWarfareIndicatorService;
