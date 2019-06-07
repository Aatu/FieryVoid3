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
      "/img/3d/ships/protectorate/Mouros/scene.gltf"
    );
    //object.scale.set(2, 2, 2);
    this.startRotation = { x: 90, y: 90, z: 0 };

    this.shipObject = object;
    this.setRotation(this.rotation.x, this.rotation.y, this.rotation.z);
    this.mesh.add(this.shipObject);
    object.position.set(0, 0, this.shipZ);

    console.log(this.shipObject);

    super.replaceSocketByName(
      [
        "Middle_hull_depress_top",
        "Middle_hull_frame_top",
        "Middle_hull_depress_left",
        "Middle_hull_depress_right",
        "Middle_hull_frame_left",
        "Middle_hull_frame_right"
      ],
      await loadObject(
        "/img/3d/systems/weapons/conventional/30mmPDC/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        "thruster_1",
        "thruster_6",
        "thruster_2",
        "thruster_4",
        "thruster_3",
        "thruster_5"
      ],
      await loadObject("/img/3d/systems/thrusters/8mThruster/scene.gltf")
    );
  }

  render() {
    super.render();

    /*
    if (this.shipObject) {
      this.shipObject.rotation.y += 0.006;
      this.shipObject.rotation.z += 0.006;
    }
    */
  }
}

export default Fulcrum;
