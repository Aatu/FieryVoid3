import ShipObject from "../ShipObject";
import { loadObject } from "../../../utils/objectLoader";
import * as THREE from "three";

class Rhino extends ShipObject {
  constructor(ship, scene) {
    super(ship, scene);
    this.defaultHeight = 50;
    this.sideSpriteSize = 30;
    this.create();
  }

  async create() {
    super.create();

    const object = await loadObject("/img/3d/turska/scene.gltf");

    //object.castShadow = true;
    //object.receiveShadow = true;
    //object.children[0].castShadow = true;
    //object.children[0].receiveShadow = true;

    console.log(object);
    /*
      window.Loader.loadTexturesAndAssign(
        object.children[0],
        {
          normalScale: new THREE.Vector2(1, 1),
          shininess: 10,
          color: new THREE.Color(1, 1, 1)
        },
        "img/3d/rhino/texture.png",
        "img/3d/rhino/sculptNormal.png"
      );
      window.Loader.loadTexturesAndAssign(
        object.children[1],
        {},
        "img/3d/diffuseDoc.png",
        "img/3d/normalDoc.png"
      );
      window.Loader.loadTexturesAndAssign(
        object.children[2],
        {},
        "img/3d/diffuseThruster.png",
        "img/3d/normalThruster.png"
      );
      */

    //object.scale.set(2, 2, 2);
    this.startRotation = { x: 90, y: 90, z: 0 };

    this.shipObject = object;
    this.setRotation(this.rotation.x, this.rotation.y, this.rotation.z);
    this.mesh.add(this.shipObject);
    object.position.set(0, 0, this.shipZ);

    const radiator = await loadObject("/img/3d/radiator/scene.gltf");
    const autoCannon = await loadObject(
      "/img/3d/systems/weapons/conventional/85mmAutoCannon/scene.gltf"
    );

    console.log("autoCannon?", radiator);
    super.replaceSocketByName(
      [
        "engine_pylon_top_front",
        "engine_pylon_left_front",
        "engine_pylon_right_front"
      ],
      radiator
    );

    super.replaceSocketByName(
      [
        "font_hull_bottom",
        "font_hull_top",
        "engine_pylon_top",
        "engine_pylon_left",
        "engine_pylon_right",
        "main_hull_front_left_bottom",
        "main_hull_front_left_side",
        "main_hull_front_left_top",
        "main_hull_front_right_bottom",
        "main_hull_front_right_side",
        "main_hull_front_right_top"
      ],
      autoCannon
    );

    console.log(this.shipObject);
  }

  render() {
    super.render();

    if (this.shipObject) {
      //this.shipObject.rotation.x += 0.001;
      this.shipObject.rotation.y += 0.001;
      //this.shipObject.rotation.z += 0.001;
      //this.setFacing(-60);
    }
  }
}

export default Rhino;
