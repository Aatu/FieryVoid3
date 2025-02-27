import ShipObject from "../ShipObject";
import * as THREE from "three";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { loadObject3d } from "../../gameObject/GameObject3D";

class Rhino extends ShipObject {
  constructor(ship: Ship, scene: THREE.Object3D) {
    super(ship, scene);
    this.defaultHeight = 50;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.create();
  }

  async create() {
    super.create();

    const object = await loadObject3d("/img/3d/caliope/scene.gltf");
    /*
    const radiator = await loadObject3d("/img/3d/radiator/scene.gltf");
    const autoCannon = await loadObject3d(
      "/img/3d/systems/weapons/conventional/85mmAutoCannon/scene.gltf"
    );

 

    super.replaceSocketByName(
      [
        "engine_pylon_top_front",
        "engine_pylon_left_front",
        "engine_pylon_right_front",
      ],
      radiator
    );

    super.replaceSocketByName(
      [
        "engine_pylon_top",
        "engine_pylon_left",
        "engine_pylon_right",
        "main_hull_front_left_bottom",
        "main_hull_front_left_top",
        "main_hull_front_right_bottom",
        "main_hull_front_right_top",
      ],
      autoCannon
    );

    super.replaceSocketByName(
      [
        "font_hull_bottom",
        "font_hull_top",
        "main_hull_front_left_side",
        "main_hull_front_right_side",
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/30mmPDC/scene.gltf"
      )
    );

    super.replaceSocketByName(
      ["thruster_top", "thruster_right", "thruster_left"],
      await loadObject3d("/img/3d/systems/thrusters/5mThruster/scene.gltf")
    );



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

    this.setShipObject(object);
  }
}

export default Rhino;
