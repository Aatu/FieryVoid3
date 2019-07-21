import * as THREE from "three";
import UiStrategy from "../UiStrategy";
import {
  degreeToRadian,
  addToDirection,
  getArcLength
} from "../../../../../../model/utils/math";

const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color("rgb(20,80,128)"),
  opacity: 0.5,
  transparent: true
});

class WeaponArcsOnSystemMouseOver extends UiStrategy {
  constructor() {
    super();
    this.weaponArcs = [];
  }

  deactivate() {
    this.hide();
  }

  systemMouseOver({ ship, system }) {
    if (!system.callHandler("hasArcs")) {
      return;
    }

    this.show(ship, system);
  }

  systemMouseOut() {
    this.hide();
  }

  hide() {
    const { scene } = this.services;
    this.weaponArcs = this.weaponArcs.filter(({ mesh, circle }) => {
      mesh.remove(circle);
    });
  }

  show(ship, system) {
    const { coordinateConverter, shipIconContainer } = this.services;
    const icon = shipIconContainer.getByShip(ship);

    const distance =
      system.callHandler("getMaxRange") * coordinateConverter.getHexDistance();

    const arcsList = system.callHandler("getArcs", {
      facing: icon.getFacing()
    });

    arcsList.forEach(arcs => {
      const arcLenght =
        arcs.start === arcs.end ? 360 : getArcLength(arcs.start, arcs.end);

      const geometry = new THREE.CircleGeometry(
        distance,
        32,
        degreeToRadian(arcs.start),
        degreeToRadian(arcLenght)
      );

      var circle = new THREE.Mesh(geometry, material);
      circle.position.z = -1;
      icon.mesh.add(circle);
      this.weaponArcs.push({ mesh: icon.mesh, circle });
    });
  }
}

export default WeaponArcsOnSystemMouseOver;
