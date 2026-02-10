import * as THREE from "three";
import ShipEWIndicators from "./ShipEWIndicators";
import ShipCurrentEWIndicators from "./ShipCurrentEWIndicators";
import ShipIconContainer from "../icon/ShipIconContainer";
import { User } from "@fieryvoid3/model/src/User/User";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

/*
const COLOR_OEW_DIST = new THREE.Color(255 / 255, 157 / 255, 0 / 255);
const COLOR_SDEW = new THREE.Color(109 / 255, 189 / 255, 255 / 255);
const COLOR_OEW_SOEW = new THREE.Color(1, 1, 1);
*/

class ElectronicWarfareIndicatorService {
  private scene: THREE.Object3D;
  private shipIconContainer: ShipIconContainer;
  private currentUser: User | null;
  private indicators: ShipEWIndicators[] = [];
  private currentIndicators: ShipCurrentEWIndicators[] = [];

  constructor(
    scene: THREE.Object3D,
    iconContainer: ShipIconContainer,
    currentUser: User | null
  ) {
    this.scene = scene;
    this.shipIconContainer = iconContainer;
    this.currentUser = currentUser;
  }

  getCurrentIndicators(ship: Ship) {
    let indicator = this.currentIndicators.find((indicator) =>
      indicator.isShip(ship)
    );

    if (!indicator) {
      indicator = new ShipCurrentEWIndicators(
        ship,
        this.shipIconContainer,
        this.currentUser,
        this.scene
      );

      this.currentIndicators.push(indicator);
    }

    return indicator;
  }

  getIndicators(ship: Ship) {
    let indicator = this.indicators.find((indicator) => indicator.isShip(ship));

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

  render(payload: RenderPayload) {
    this.indicators.forEach((indicator) => indicator.render(payload));
    this.currentIndicators.forEach((indicator) => indicator.render(payload));
  }

  showCurrentForShip(ship: Ship) {
    this.getCurrentIndicators(ship).update(ship).show();
  }

  hideCurrentForShip(ship: Ship) {
    this.getCurrentIndicators(ship).update(ship).hide();
  }

  showForShip(ship: Ship) {
    this.getIndicators(ship).update(ship).show();
  }

  hideForShip(ship: Ship) {
    this.getIndicators(ship).update(ship).hide();
  }

  hideAll() {
    this.indicators.forEach((indicators) => indicators.hide());
  }

  hideAllCurrent() {
    this.currentIndicators.forEach((indicators) => indicators.hide());
  }
}

export default ElectronicWarfareIndicatorService;
