import ShipObject from "../ShipObject";
import { loadObject, cloneObject } from "../../../utils/objectLoader";
import * as THREE from "three";

class Fulcrum extends ShipObject {
  constructor(ship, scene) {
    super(ship, scene);
    this.defaultHeight = 50;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.create();
  }

  async create() {
    super.create();
    const object = await loadObject(
      "/img/3d/ships/protectorate/Fulcrum/scene.gltf"
    );

    this.startRotation = { x: 90, y: 90, z: 0 };
    this.setRotation(this.rotation.x, this.rotation.y, this.rotation.z);

    object.position.set(0, 0, this.defaultHeight);

    super.replaceSocketByName(
      [
        "rear_hull_radiator_left",
        "rear_hull_radiator_right",
        "rear_hull_radiator_bottom"
      ],
      await loadObject("/img/3d/systems/radiators/5x40mSail/scene.gltf")
    );

    super.replaceSocketByName(
      [
        "front_hull_pdc_bottom",
        "front_hull_pdc_left",
        "front_hull_pdc_right",
        "rear_hull_pdc_top",
        "rear_hull_pdc_right",
        "rear_hull_pdc_left"
      ],
      await loadObject(
        "/img/3d/systems/weapons/conventional/30mmPDC/scene.gltf"
      )
    );

    super.replaceSocketByName(
      ["thruster"],
      await loadObject("/img/3d/systems/thrusters/5mThruster/scene.gltf")
    );

    this.setShipObject(object);
  }
}

export default Fulcrum;
