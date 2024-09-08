import ShipObject from "../ShipObject";
import { loadObject3d } from "../../gameObject/GameObject3D";
import * as THREE from "three";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import { RenderPayload } from "../../../phase/phaseStrategy/PhaseStrategy";
import { ShipTextureBuilder } from "../../shiptexture/ShipTextureBuilder";

const textureLoader = new THREE.TextureLoader();

class Constantin extends ShipObject {
  private centrifuge: THREE.Object3D | null = null;

  constructor(ship: Ship, scene: THREE.Object3D) {
    super(ship, scene);
    this.defaultHeight = 80;
    this.sideSpriteSize = 30;
    this.overlaySpriteSize = 80;
    this.dimensions = new Vector(80, 22, 8);
    this.center = new Vector(0, 0, 0);
    this.ewSpriteDimensions = new Vector(155, 50);
    this.create();
  }

  async create() {
    super.create();
    const gameObject = await loadObject3d("/img/3d/constantin/constantin.gltf");
    gameObject.setShipObjectNames([
      "main_ship_1",
      "main_ship_2",
      "ship_centrifuge_1",
      "ship_centrifuge_2",
    ]);

    const texturebuilder = new ShipTextureBuilder(
      gameObject,
      "shipmaterial",
      1024,
      1024
    );
    texturebuilder.setBaseColor([31, 27, 27]);
    texturebuilder.overlayImage("/img/3d/constantin/basecolor.png");
    texturebuilder.overlayImage("/img/3d/constantin/basecolor.png");

    const color = [255, 255, 255, 1];
    texturebuilder.writeText(this.ship.getName(), color, {
      x: 130,
      y: 575,
      width: 100,
    });
    texturebuilder.writeText(this.ship.getName(), color, {
      x: 130,
      y: 115,
      width: 100,
      flipY: true,
    });

    const registration = "EDS 452";
    texturebuilder.writeText(registration, color, {
      x: 858,
      y: 130,
      flipY: true,
      flipX: true,
      size: 26,
      width: 100,
      bold: true,
    });

    texturebuilder.writeText(registration, color, {
      x: 858,
      y: 270,
      flipY: false,
      flipX: false,
      size: 26,
      width: 100,
      bold: true,
    });

    texturebuilder.writeText(registration, color, {
      x: 858,
      y: 485,
      flipY: true,
      flipX: true,
      size: 26,
      width: 100,
      bold: true,
    });

    texturebuilder.writeText(registration, color, {
      x: 858,
      y: 625,
      flipY: false,
      flipX: false,
      size: 26,
      width: 100,
      bold: true,
    });

    texturebuilder.drawImage("/img/logo_earthdomainnavy.png", {
      x: 370,
      y: 768,
      width: 100,
      height: 100,
      rotation: 90,
    });

    texturebuilder.drawImage("/img/logo_earthdomainnavy.png", {
      x: 585,
      y: 768,
      width: 100,
      height: 100,
      rotation: 90,
    });

    texturebuilder.done();

    gameObject.swapNormalAndBumpMap(10);

    this.centrifuge =
      gameObject.scene.children.find((o) => o.name === "ship_centrifuge") ||
      null;

    /*
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
 */
    this.setShipObject(gameObject);
  }

  render(payload: RenderPayload) {
    if (!this.centrifuge || !this.shipObject) {
      return;
    }

    this.centrifuge.rotateX(0.005);
    //this.shipObject.getObject().rotateZ(0.001);
    //this.shipObject.getObject().rotateX(0.001);
  }
}

export default Constantin;
