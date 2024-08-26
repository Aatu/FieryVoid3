import ShipObject from "../ShipObject";
import { loadObject3d } from "../../gameObject/GameObject3D";
import * as THREE from "three";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import Vector from "@fieryvoid3/model/src/utils/Vector";

const textureLoader = new THREE.TextureLoader();

class Caliope extends ShipObject {
  constructor(ship: Ship, scene: THREE.Object3D) {
    super(ship, scene);
    this.defaultHeight = 80;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.dimensions = new Vector(80, 22, 8);
    this.center = new Vector(0, 0, 0);
    this.ewSpriteDimensions = new Vector(95, 40);
    this.create();
  }

  async create() {
    super.create();
    const gameObject = await loadObject3d("/img/3d/caliope/scene.gltf");
    gameObject.setShipObjectNames("ship");
    gameObject.setBumpMap(textureLoader.load("/img/3d/caliope/heightMap.png"));
    gameObject.setEmissiveMap(
      textureLoader.load("/img/3d/caliope/emissiveMap.png")
    );

    gameObject.getObject().position.set(0, 0, this.defaultHeight);

    const radiator = await loadObject3d("/img/3d/radiator/scene.gltf");

    const autoCannon = await loadObject3d(
      "/img/3d/systems/weapons/conventional/85mmAutoCannon/scene.gltf"
    );

    gameObject.replaceSocketByName(
      [
        { name: "engine_pylon_top_front", id: 421 },
        { name: "engine_pylon_left_front", id: 521 },
        { name: "engine_pylon_right_front", id: 321 },
      ],
      null // autoCannon
    );

    gameObject.replaceSocketByName(
      [
        { name: "engine_pylon_top", id: 412 },
        { name: "engine_pylon_left", id: 501 },
        { name: "engine_pylon_right", id: 301 },
      ],
      radiator
    );

    gameObject.replaceSocketByName(
      [
        { name: "main_hull_front_left_bottom", id: 603 },
        { name: "main_hull_front_left_top", id: 604 },
        { name: "main_hull_front_right_bottom", id: 203 },
        { name: "main_hull_front_right_top", id: 204 },
      ],
      autoCannon
    );

    gameObject.replaceSocketByName(
      [
        { name: "front_hull_right_side", id: 213 },
        { name: "front_hull_left_side", id: 612 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/railgun/2x140mmRailgunTurret/scene.gltf"
      )
    );

    gameObject.replaceSocketByName(
      [
        { name: "font_hull_bottom", id: 115 },
        { name: "font_hull_top", id: 114 },
        { name: "main_hull_front_left_side", id: 602 },
        { name: "main_hull_front_right_side", id: 202 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/30mmPDC/scene.gltf"
      )
    );

    const thruster = await loadObject3d(
      "/img/3d/systems/thrusters/5mThruster/scene.gltf"
    );

    gameObject.replaceSocketByName(
      [
        { name: "thruster_top", id: 123 },
        { name: "thruster_right", id: 123 },
        { name: "thruster_left", id: 123 },
      ],
      thruster,
      "thruster"
    );

    this.setShipObject(gameObject);

    /*
    const shipMaterial = this.shipObject.children[0].material;

    shipMaterial.emissive = new THREE.Color(1, 1, 1);
    shipMaterial.emissiveMap = new THREE.TextureLoader().load(
      "/img/3d/caliope/emissiveMap.png"
    );
    shipMaterial.emissiveMap.flipY = false;
*/
    /*
    this.shipObject.traverse(o => {
      if (o.isMesh) {
        o.material.emissive = new THREE.Color(1, 1, 1);
        o.material.emissiveMap = new THREE.TextureLoader().load(
          "/img/3d/caliope/baseColor.png"
        );
        o.material.emissiveMap.flipY = false;


      }
    });

    */
  }
}

export default Caliope;
