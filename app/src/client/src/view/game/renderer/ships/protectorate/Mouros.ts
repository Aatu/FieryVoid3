import Ship from "@fieryvoid3/model/src/unit/Ship";
import { loadObject3d } from "../../gameObject/GameObject3D";
import ShipObject from "../ShipObject";
import * as THREE from "three";

class Mouros extends ShipObject {
  constructor(ship: Ship, scene: THREE.Object3D) {
    super(ship, scene);
    this.defaultHeight = 10;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.create();
  }

  async create() {
    super.create();
    const object = await loadObject3d(
      "/img/3d/ships/protectorate/Mouros/scene.gltf"
    );

    object.getObject().position.set(0, 0, this.defaultHeight);

    super.replaceSocketByName(
      [
        { name: "Middle_hull_depress_top", id: 123 },
        { name: "Middle_hull_depress_left", id: 123 },
        { name: "Middle_hull_depress_right", id: 123 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/85mmAutoCannon/scene.gltf"
        //"/img/3d/systems/weapons/conventional/30mmPDC/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "Middle_hull_frame_top", id: 123 },
        { name: "Middle_hull_frame_left", id: 123 },
        { name: "Middle_hull_frame_right", id: 123 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/140mmCannonTurret/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "railgun_turret_mount_right", id: 123 },
        { name: "railgun_turret_mount_left", id: 123 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/coilgun/turreted32GwRailgun/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "thruster_1", id: 123 },
        { name: "thruster_6", id: 123 },
        { name: "thruster_2", id: 123 },
        { name: "thruster_4", id: 123 },
        { name: "thruster_3", id: 123 },
        { name: "thruster_5", id: 123 },
      ],
      await loadObject3d("/img/3d/systems/thrusters/8mThruster/scene.gltf")
    );

    this.setShipObject(object);
  }
}

export default Mouros;
