import Ship from "@fieryvoid3/model/src/unit/Ship";
import { loadObject3d } from "../../gameObject/GameObject3D";
import ShipObject from "../ShipObject";
import * as THREE from "three";

class Impetous extends ShipObject {
  constructor(ship: Ship, scene: THREE.Object3D) {
    super(ship, scene);
    this.defaultHeight = 15;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.create();
  }

  async create() {
    super.create();
    const object = await loadObject3d(
      "/img/3d/ships/federation/Impetous/scene.gltf"
    );

    object.getObject().position.set(0, 0, this.defaultHeight);
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
        "/img/3d/systems/weapons/coilgun/turreted64GwRailgun/scene.gltf"
      )
    );

    */

    object.replaceSocketByName(
      [
        { name: "engine_mount_2", id: 123 },
        { name: "engine_mount_3", id: 123 },
        { name: "engine_mount_4", id: 123 },
        { name: "engine_mount_5", id: 123 },
      ],
      await loadObject3d("/img/3d/systems/thrusters/10mThruster/scene.gltf")
    );

    object.replaceSocketByName(
      [
        { name: "front-wing-left-mount1", id: 501 },
        { name: "front-wing-left-mount2", id: 502 },
        { name: "front-wing-left-mount3", id: 503 },
        { name: "front-wing-right-mount1", id: 101 },
        { name: "front-wing-right-mount2", id: 102 },
        { name: "front-wing-right-mount3", id: 103 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/2x30mmPDC/scene.gltf"
      )
    );

    object.replaceSocketByName(
      [{ name: "middle-top-mount1", id: 623 }],
      await loadObject3d(
        "/img/3d/systems/weapons/coilgun/turreted64GwRailgun/scene.gltf"
      )
    );

    object.replaceSocketByName(
      [
        { name: "front-wing-left-top-mount1", id: 623 },
        { name: "front-wing-left-bottom-mount1", id: 623 },
        { name: "aft-wing-left-top-mount1", id: 623 },
        { name: "aft-wing-left-bottom-mount1", id: 623 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/2x140mmCannonTurret/scene.gltf"
      )
    );

    object.replaceSocketByName(
      [
        { name: "front-wing-left-top-mount2", id: 623 },
        { name: "front-wing-left-bottom-mount2", id: 623 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/85mmAutoCannon/scene.gltf"
      )
    );

    this.setShipObject(object);
  }
}

export default Impetous;
