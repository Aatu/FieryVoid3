import ShipObject from "../ShipObject";
import { loadObject3d } from "../../object3d/Object3d";
import * as THREE from "three";

class Fulcrum extends ShipObject {
  constructor(ship, scene) {
    super(ship, scene);
    this.defaultHeight = 100;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.create();
  }

  async create() {
    super.create();
    const object = await loadObject3d(
      "/img/3d/ships/protectorate/Fulcrum/scene.gltf"
    );

    object.object.position.set(0, 0, this.defaultHeight);

    super.replaceSocketByName(
      [
        { name: "rear_hull_radiator_left", id: 416 },
        { name: "rear_hull_radiator_right", id: 216 },
        { name: "rear_hull_radiator_bottom", id: 316 }
      ],
      await loadObject3d("/img/3d/systems/radiators/5x40mSail/scene.gltf")
    );

    super.replaceSocketByName(
      [{ name: "front_plate_center", id: 102 }],
      await loadObject3d(
        "/img/3d/systems/weapons/coilgun/fixed22GwCoilgun/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "front_hull_pdc_bottom", id: 14 },
        { name: "front_hull_pdc_left", id: 13 },
        { name: "front_hull_pdc_right", id: 15 },
        { name: "rear_hull_pdc_top", id: 214 },
        { name: "rear_hull_pdc_right", id: 215 },
        { name: "rear_hull_pdc_left", id: 213 }
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/30mmPDC/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [{ name: "thruster", id: 123 }],
      await loadObject3d("/img/3d/systems/thrusters/5mThruster/scene.gltf")
    );

    this.setShipObject(object);
  }
}

export default Fulcrum;
