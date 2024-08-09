import ShipObject from "../ShipObject";
import { loadObject3d } from "../../object3d/Object3d";
import * as THREE from "three";
import Vector from "../../../../../../model/utils/Vector";

const textureLoader = new THREE.TextureLoader();

class Haka extends ShipObject {
  constructor(ship, scene) {
    super(ship, scene);
    this.defaultHeight = 80;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.dimensions = new Vector(150, 40, 40);
    this.center = new Vector(0, 0, 0);
    this.ewSpriteDimensions = new Vector(180, 80);

    this.create();
  }

  async create() {
    super.create();
    const object = await loadObject3d("/img/3d/ships/uc/haka/scene.gltf");

    this.bumpMap = await textureLoader.load(
      "/img/3d/ships/uc/haka/heightMap.png"
    );

    super.replaceSocketByName(
      [
        { name: "socket_middle_pylon_top", id: 602 },
        { name: "socket_front_top_1", id: 606 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/coilgun/turreted32GwRailgun/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [{ name: "socket_middle_pylon_bottom", id: 202 }],
      await loadObject3d(
        "/img/3d/systems/weapons/railgun/2x140mmRailgunTurret/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "socket_main_pylon_left", id: 118 },
        { name: "socket_main_pylon_right", id: 119 },
        { name: "socket_front_top_2", id: 603 },
        { name: "socket_front_top_3", id: 604 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/railgun/140mmRailgunTurret/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "socket_engine_1", id: 123 },
        { name: "socket_engine_2", id: 123 },
        { name: "socket_engine_3", id: 123 },
        { name: "socket_engine_4", id: 123 },
      ],
      await loadObject3d("/img/3d/systems/thrusters/10mThruster/scene.gltf")
    );

    super.replaceSocketByName(
      [
        { name: "socket_engine_pylon_1", id: 550 },
        { name: "socket_engine_pylon_2", id: 551 },
        { name: "socket_engine_pylon_3", id: 554 },
        { name: "socket_engine_pylon_4", id: 555 },
        { name: "socket_engine_pylon_5", id: 352 },
        { name: "socket_engine_pylon_6", id: 353 },
        { name: "socket_engine_pylon_7", id: 356 },
        { name: "socket_engine_pylon_8", id: 357 },
        { name: "socket_engine_pylon_9", id: 451 },
        { name: "socket_engine_pylon_10", id: 456 },
        { name: "socket_engine_pylon_11", id: 450 },
        { name: "socket_engine_pylon_12", id: 452 },
        { name: "socket_engine_pylon_13", id: 457 },
        { name: "socket_engine_pylon_14", id: 455 },
        { name: "socket_engine_pylon_15", id: 453 },
        { name: "socket_engine_pylon_16", id: 454 },
        { name: "socket_main_right_1", id: 114 },
        { name: "socket_main_right_2", id: 115 },
        { name: "socket_main_left_1", id: 116 },
        { name: "socket_main_left_2", id: 117 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/30mmPDC/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "socket_radiator_5", id: 301 },
        { name: "socket_radiator_6", id: 302 },
        { name: "socket_radiator_7", id: 502 },
        { name: "socket_radiator_8", id: 503 },
      ],
      await loadObject3d("/img/3d/systems/radiators/10x40/scene.gltf")
    );

    super.replaceSocketByName(
      [
        { name: "socket_radiator_1", id: 416 },
        { name: "socket_radiator_2", id: 216 },
        { name: "socket_radiator_3", id: 416 },
        { name: "socket_radiator_4", id: 216 },
      ],
      null
    );

    /*
     new systems.PDC30mm({ id: 450 }, { start: 160, end: 340 }),
      new systems.PDC30mm({ id: 451 }, { start: 160, end: 340 }),

      new systems.PDC30mm({ id: 452 }, { start: 40, end: 200 }),
      new systems.PDC30mm({ id: 453 }, { start: 40, end: 200 }),

      new systems.PDC30mm({ id: 454 }, { start: 160, end: 340 }),
      new systems.PDC30mm({ id: 455 }, { start: 160, end: 340 }),

      new systems.PDC30mm({ id: 456 }, { start: 40, end: 200 }),
      new systems.PDC30mm({ id: 457 }, { start: 40, end: 200 })
      */

    this.setShipObject(object);
  }
}

export default Haka;
