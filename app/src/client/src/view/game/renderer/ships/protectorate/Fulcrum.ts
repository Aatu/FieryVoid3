import ShipObject from "../ShipObject";
import * as THREE from "three";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { loadObject3d } from "../../gameObject/GameObject3D";
import Vector from "@fieryvoid3/model/src/utils/Vector";

const textureLoader = new THREE.TextureLoader();

class Fulcrum extends ShipObject {
  constructor(ship: Ship, scene: THREE.Object3D) {
    super(ship, scene);
    this.defaultHeight = 100;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.dimensions = new Vector(55, 12, 12);
    this.center = new Vector(0, 0, 0);
    this.ewSpriteDimensions = new Vector(65, 30);
    this.create();
  }

  async create() {
    super.create();
    const object = await loadObject3d(
      "/img/3d/ships/protectorate/fulcrum/scene.gltf"
    );
    this.bumpMap = await textureLoader.load(
      "/img/3d/ships/protectorate/fulcrum/heightMap.png"
    );

    object.getObject().position.set(0, 0, this.defaultHeight);

    super.replaceSocketByName(
      [
        { name: "rear_hull_radiator_left", id: 416 },
        { name: "rear_hull_radiator_right", id: 216 },
        { name: "rear_hull_radiator_bottom", id: 316 },
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
        { name: "rear_hull_pdc_left", id: 213 },
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
