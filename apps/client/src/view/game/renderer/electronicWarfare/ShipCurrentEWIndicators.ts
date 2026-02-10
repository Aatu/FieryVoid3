import Ship from "@fieryvoid3/model/src/unit/Ship";
import CurrentOEWIndicator from "./CurrentOEWIndicator";
import ShipIconContainer from "../icon/ShipIconContainer";
import { User } from "@fieryvoid3/model";
import * as THREE from "three";
import ShipObject from "../ships/ShipObject";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

class ShipCurrentEWIndicators {
  private ship: Ship;
  private icon: ShipObject;
  private shipIconContainer: ShipIconContainer;
  private currentUser: User | null;
  private scene: THREE.Object3D;
  private oew: CurrentOEWIndicator[];

  constructor(
    ship: Ship,
    shipIconContainer: ShipIconContainer,
    currentUser: User | null,
    scene: THREE.Object3D
  ) {
    this.ship = ship;
    this.icon = shipIconContainer.getByShip(ship);
    this.shipIconContainer = shipIconContainer;
    this.currentUser = currentUser;
    this.scene = scene;
    this.oew = [];

    this.update(this.ship);
  }

  update(ship: Ship) {
    this.ship = ship;
    this.oew = this.createOEW();

    return this;
  }

  show() {
    this.oew.forEach((oew) => oew.show());
    return this;
  }

  hide() {
    this.oew.forEach((oew) => oew.hide());
    return this;
  }

  isShip(ship: Ship) {
    return this.ship.id === ship.id;
  }

  render(payload: RenderPayload) {
    this.oew.forEach((oew) => oew.render(payload));
  }

  createOEW() {
    const old = this.oew;
    const newOew = this.ship.electronicWarfare.inEffect
      .getAllOew()
      .map((ewEntry) => {
        const targetIcon = this.shipIconContainer.getById(ewEntry.targetShipId);

        let indicator = this.oew.find((oew) => oew.targetIcon === targetIcon);

        if (!indicator) {
          indicator = new CurrentOEWIndicator(
            this.icon,
            targetIcon,
            ewEntry.amount,
            this.ship.getPlayer().is(this.currentUser),
            this.scene
          );
        }

        return indicator.update(this.ship, ewEntry.amount);
      });

    old
      .filter((indicator) =>
        newOew.every((indicatorNew) => indicatorNew !== indicator)
      )
      .forEach((indicator) => indicator.remove());

    return newOew;
  }
}

export default ShipCurrentEWIndicators;
