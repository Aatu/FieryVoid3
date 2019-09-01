import ShipObject from "../ShipObject";
import { loadObject3d } from "../../object3d/Object3d";
import * as THREE from "three";

class Mouros extends ShipObject {
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
      "/img/3d/ships/protectorate/Mouros/scene.gltf"
    );

    //object.scale.set(2, 2, 2);
    this.startRotation = { x: 90, y: 90, z: 0 };

    this.setRotation(this.rotation.x, this.rotation.y, this.rotation.z);

    object.object.position.set(0, 0, this.defaultHeight);

    super.replaceSocketByName(
      [
        { name: "Middle_hull_depress_top", id: 123 },
        { name: "Middle_hull_depress_left", id: 123 },
        { name: "Middle_hull_depress_right", id: 123 }
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/30mmPDC/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "Middle_hull_frame_top", id: 123 },
        { name: "Middle_hull_frame_left", id: 123 },
        { name: "Middle_hull_frame_right", id: 123 }
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/140mmCannonTurret/scene.gltf"
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

    super.replaceSocketByName(
      [
        { name: "thruster_1", id: 123 },
        { name: "thruster_6", id: 123 },
        { name: "thruster_2", id: 123 },
        { name: "thruster_4", id: 123 },
        { name: "thruster_3", id: 123 },
        { name: "thruster_5", id: 123 }
      ],
      await loadObject3d("/img/3d/systems/thrusters/8mThruster/scene.gltf")
    );

    this.setShipObject(object);
  }
}

export default Mouros;
