import ShipObject from "../ShipObject";
import { loadObject3d } from "../../object3d/Object3d";
import * as THREE from "three";

class Impetous extends ShipObject {
  constructor(ship, scene) {
    super(ship, scene);
    this.defaultHeight = 60;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.create();
  }

  async create() {
    super.create();
    const object = await loadObject3d(
      "/img/3d/ships/federation/Impetous/scene.gltf"
    );

    //object.scale.set(2, 2, 2);
    this.startRotation = { x: 90, y: 90, z: 0 };

    this.setRotation(this.rotation.x, this.rotation.y, this.rotation.z);

    object.object.position.set(0, 0, this.defaultHeight);
    /*
    super.replaceSocketByName(
      [
        { name: "Middle_hull_depress_top", id: 123 },
        { name: "Middle_hull_frame_top", id: 123 },
        { name: "Middle_hull_depress_left", id: 123 },
        { name: "Middle_hull_depress_right", id: 123 },
        { name: "Middle_hull_frame_left", id: 123 },
        { name: "Middle_hull_frame_right", id: 123 }
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/30mmPDC/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "railgun_turret_mount_right", id: 123 },
        ,
        { name: "railgun_turret_mount_left", id: 123 }
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/railgun/turreted64GwRailgun/scene.gltf"
      )
    );

    */
    super.replaceSocketByName(
      [
        { name: "engine_mount_2", id: 123 },
        { name: "engine_mount_3", id: 123 },
        { name: "engine_mount_4", id: 123 },
        { name: "engine_mount_5", id: 123 }
      ],
      await loadObject3d("/img/3d/systems/thrusters/10mThruster/scene.gltf")
    );

    this.setShipObject(object);
  }
}

export default Impetous;
