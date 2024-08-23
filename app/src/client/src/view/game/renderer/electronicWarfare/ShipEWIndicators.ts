import Ship from "@fieryvoid3/model/src/unit/Ship";
import OEWIndicator from "./OEWIndicator";
import ShipIconContainer from "../icon/ShipIconContainer";
import { User } from "@fieryvoid3/model";
import * as THREE from "three";
import ShipObject from "../ships/ShipObject";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

class ShipEWIndicators {
  private ship: Ship;
  private icon: ShipObject;
  private shipIconContainer: ShipIconContainer;
  private currentUser: User | null;
  private scene: THREE.Object3D;
  private oew: OEWIndicator[];

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
    this.createOEW();

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

  async createOEW() {
    await this.shipIconContainer.shipsLoaded();
    const old = this.oew;
    const newOew = this.ship.electronicWarfare.getAllOew().map((ewEntry) => {
      const targetIcon = this.shipIconContainer.getById(ewEntry.targetShipId);
      const targetGhost = this.shipIconContainer.getGhostShipIconByShip(
        targetIcon.ship
      );
      const shipGhost = this.shipIconContainer.getGhostShipIconByShip(
        this.icon.ship
      );

      let indicator = this.oew.find((oew) => oew.targetIcon === targetIcon);

      if (!indicator) {
        indicator = new OEWIndicator(
          this.icon,
          targetIcon,
          targetGhost,
          shipGhost,
          ewEntry.amount,
          this.ship.player.is(this.currentUser),
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

    this.oew = newOew;
  }
}

export default ShipEWIndicators;
