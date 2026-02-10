import * as THREE from "three";
import UiStrategy from "../UiStrategy";
import Line from "../../../renderer/Line";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import Vector from "@fieryvoid3/model/src/utils/Vector";

class WeaponTargetingMouseoverShowsLine extends UiStrategy {
  private lines: Line[] = [];

  systemMouseOver({ ship, target }: { ship: Ship; target: Ship }) {
    this.show(ship, target);
  }

  torpedoMouseOver({ ship, target }: { ship: Ship; target: Ship }) {
    this.show(ship, target);
  }

  systemMouseOut() {
    this.hide();
  }

  torpedoMouseOut() {
    this.hide();
  }

  hide() {
    this.lines.forEach((line) => line.destroy());
    this.lines = [];
  }

  show(shooter: Ship, target: Ship) {
    if (!target) {
      return;
    }

    const { scene, shipIconContainer } = this.getServices();

    const shooterIcon = shipIconContainer.getByShip(shooter);
    const targetIcon = shipIconContainer.getByShip(target);

    const line = new Line(scene, {
      start: new Vector({ ...shooterIcon.getPosition(), z: shooterIcon.shipZ }),
      end: new Vector({ ...targetIcon.getPosition(), z: targetIcon.shipZ }),
      width: 20,
      color: new THREE.Color(196 / 255, 196 / 255, 39 / 255),
      opacity: 0.1,
      pulseAmount: 1,
      dashSize: 0,
    });

    this.lines.push(line);
  }

  deactivate() {
    this.lines.forEach((line) => line.destroy());
    this.lines = [];
  }
}

export default WeaponTargetingMouseoverShowsLine;
