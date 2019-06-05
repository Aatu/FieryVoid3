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
      "/img/3d/ships/protectorate/fulcrum/scene.gltf"
    );
    //object.scale.set(2, 2, 2);
    this.startRotation = { x: 90, y: 90, z: 0 };

    this.shipObject = object;
    this.setRotation(this.rotation.x, this.rotation.y, this.rotation.z);
    this.mesh.add(this.shipObject);
    object.position.set(0, 0, this.shipZ);

    /*
    const radiator = await loadObject("/img/3d/radiator/scene.gltf");
    const autoCannon = await loadObject(
      "/img/3d/systems/weapons/conventional/85mmAutoCannon/scene.gltf"
    );

    super.replaceSocketByName(
      [
        "engine_pylon_top_front",
        "engine_pylon_left_front",
        "engine_pylon_right_front"
      ],
      radiator
    );

    super.replaceSocketByName(
      [
        "engine_pylon_top",
        "engine_pylon_left",
        "engine_pylon_right",
        "main_hull_front_left_bottom",
        "main_hull_front_left_top",
        "main_hull_front_right_bottom",
        "main_hull_front_right_top"
      ],
      autoCannon
    );
*/

    console.log(this.shipObject);

    //"front_hull_torpedo"

    /*

*/

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
  }

  render() {
    super.render();

    if (this.shipObject) {
      this.shipObject.rotation.y += 0.006;
      this.shipObject.rotation.z += 0.006;
    }
  }
}

export default Fulcrum;
