import * as THREE from "three";
import Line from "../Line";
import OEWIndicator from "./OEWIndicator";
import ShipObject from "../ships/ShipObject";
import Vector from "@fieryvoid3/model/src/utils/Vector";

const COLOR_OEW_FRIENDLY = new THREE.Color(100 / 255, 90 / 255, 250 / 255);
const COLOR_OEW_ENEMY = new THREE.Color(255 / 255, 40 / 255, 40 / 255);

class CurrentOEWIndicator extends OEWIndicator {
  constructor(
    shipIcon: ShipObject,
    targetIcon: ShipObject,
    amount: number,
    mine: boolean,
    scene: THREE.Object3D
  ) {
    super(shipIcon, targetIcon, null, null, amount, mine, scene);
  }

  createLine() {
    return new Line(this.scene, {
      start: new Vector({ ...this.shipIcon.getPosition(), z: this.getZ() }),
      end: new Vector({ ...this.targetPosition, z: this.getZ() }),
      width: this.amount * 1 + 5,
      color: this.mine ? COLOR_OEW_FRIENDLY : COLOR_OEW_ENEMY,
      opacity: 0.1,
      pulseAmount: 1,
      dashSize: 0,
    });
  }

  getZ() {
    return 0;
    return this.mine ? 15 : 30;
  }
}

export default CurrentOEWIndicator;
