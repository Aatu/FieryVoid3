import ShipObject from "../ShipObject";
import { loadObject3d } from "../../object3d/Object3d";
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

class Caliope extends ShipObject {
  constructor(ship, scene) {
    super(ship, scene);
    this.defaultHeight = 80;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.dimensions = { x: 95, y: 35 };
    this.center = { x: 8, y: 0 };
    this.create();
  }

  async create() {
    super.create();
    const object = await loadObject3d("/img/3d/caliope/scene.gltf");
    this.bumpMap = await textureLoader.load("/img/3d/caliope/heightMap.png");

    object.object.position.set(0, 0, this.defaultHeight);

    const radiator = await loadObject3d("/img/3d/radiator/scene.gltf");
    const autoCannon = await loadObject3d(
      "/img/3d/systems/weapons/conventional/85mmAutoCannon/scene.gltf"
    );

    super.replaceSocketByName(
      [
        { name: "engine_pylon_top_front", id: 412 },
        { name: "engine_pylon_left_front", id: 501 },
        { name: "engine_pylon_right_front", id: 301 },
      ],
      radiator
    );

    super.replaceSocketByName(
      [
        { name: "engine_pylon_top", id: 421 },
        { name: "engine_pylon_left", id: 521 },
        { name: "engine_pylon_right", id: 321 },
      ],
      autoCannon
    );

    super.replaceSocketByName(
      [
        { name: "main_hull_front_left_bottom", id: 603 },
        { name: "main_hull_front_left_top", id: 604 },
        { name: "main_hull_front_right_bottom", id: 203 },
        { name: "main_hull_front_right_top", id: 204 },
      ],
      autoCannon
    );

    super.replaceSocketByName(
      [
        { name: "front_hull_right_side", id: 213 },
        { name: "front_hull_left_side", id: 612 },
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/railgun/2x140mmRailgunTurret/scene.gltf"
      )
    );

    super.replaceSocketByName(
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

    super.replaceSocketByName(
      [
        { name: "thruster_top", id: 123 },
        { name: "thruster_right", id: 123 },
        { name: "thruster_left", id: 123 },
      ],
      await loadObject3d("/img/3d/systems/thrusters/5mThruster/scene.gltf")
    );

    this.setShipObject(object);

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
