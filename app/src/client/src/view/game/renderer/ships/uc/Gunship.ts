import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipObject from "../ShipObject";
import * as THREE from "three";

class Gunship extends ShipObject {
  constructor(ship: Ship, scene: THREE.Object3D) {
    super(ship, scene);
    this.defaultHeight = 30;
    this.sideSpriteSize = 50;
    this.create();
  }

  create() {
    super.create();

    /*
    window.Loader.loadObject("img/3d/gunship/gunship.obj", (object) => {
      window.Loader.loadTexturesAndAssign(
        object.children[0],
        {},
        null,
        "img/3d/gunship/normal.png"
      );

      window.Loader.loadTexturesAndAssign(
        object.children[1],
        {},
        null,
        "img/3d/turretNormal.png"
      );
      window.Loader.loadTexturesAndAssign(
        object.children[2],
        {},
        null,
        "img/3d/turretNormal.png"
      );
      window.Loader.loadTexturesAndAssign(
        object.children[3],
        {},
        null,
        "img/3d/turretNormal.png"
      );
      window.Loader.loadTexturesAndAssign(
        object.children[6],
        {},
        null,
        "img/3d/turretNormal.png"
      );
      window.Loader.loadTexturesAndAssign(
        object.children[7],
        {},
        null,
        "img/3d/turretNormal.png"
      );
      window.Loader.loadTexturesAndAssign(
        object.children[4],
        {},
        "img/3d/diffuseThruster.png",
        "img/3d/normalThruster.png"
      );
      window.Loader.loadTexturesAndAssign(
        object.children[5],
        {},
        "img/3d/diffuseThruster.png",
        "img/3d/normalThruster.png"
      );

      object.scale.set(5, 5, 5);
      this.startRotation = { x: 90, y: 90, z: 0 };
      this.shipObject = object;
      this.setRotation(this.rotation.x, this.rotation.y, this.rotation.z);
      this.mesh.add(this.shipObject);
      object.position.set(0, 0, this.shipZ);
    });
     */
  }
}

export default Gunship;
