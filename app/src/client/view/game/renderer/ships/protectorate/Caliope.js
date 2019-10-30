import ShipObject from "../ShipObject";
import { loadObject3d } from "../../object3d/Object3d";
import * as THREE from "three";

class Caliope extends ShipObject {
  constructor(ship, scene) {
    super(ship, scene);
    this.defaultHeight = 10;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.create();
  }

  async create() {
    super.create();
    const object = await loadObject3d("/img/3d/caliope/scene.gltf");
    //object.scale.set(2, 2, 2);
    this.startRotation = { x: 90, y: 90, z: 0 };

    this.setRotation(this.rotation.x, this.rotation.y, this.rotation.z);
    object.object.position.set(0, 0, this.defaultHeight);

    const radiator = await loadObject3d("/img/3d/radiator/scene.gltf");
    const autoCannon = await loadObject3d(
      "/img/3d/systems/weapons/conventional/85mmAutoCannon/scene.gltf"
    );

    /*
    console.log("radiator", radiator);
    const mixer = new THREE.AnimationMixer(radiator);
    const clips = radiator.children[0].animations;
    console.log(mixer, clips);
    */

    super.replaceSocketByName(
      [
        { name: "engine_pylon_top_front", id: 312 },
        { name: "engine_pylon_left_front", id: 201 },
        { name: "engine_pylon_right_front", id: 401 }
      ],
      radiator
    );

    super.replaceSocketByName(
      [
        { name: "engine_pylon_top", id: 123 },
        { name: "engine_pylon_left", id: 123 },
        { name: "engine_pylon_right", id: 123 }
      ],
      autoCannon
    );

    super.replaceSocketByName(
      [
        { name: "main_hull_front_left_bottom", id: 123 },
        { name: "main_hull_front_left_top", id: 123 },
        { name: "main_hull_front_right_bottom", id: 123 },
        { name: "main_hull_front_right_top", id: 123 }
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/140mmCannonTurret/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "font_hull_bottom", id: 123 },
        { name: "font_hull_top", id: 123 },
        { name: "main_hull_front_left_side", id: 123 },
        { name: "main_hull_front_right_side", id: 123 }
      ],
      await loadObject3d(
        "/img/3d/systems/weapons/conventional/30mmPDC/scene.gltf"
      )
    );

    super.replaceSocketByName(
      [
        { name: "thruster_top", id: 123 },
        { name: "thruster_right", id: 123 },
        { name: "thruster_left", id: 123 }
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
