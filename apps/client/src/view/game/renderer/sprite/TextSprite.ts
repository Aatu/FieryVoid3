import * as THREE from "three";
import abstractCanvas from "../../utils/abstractCanvas";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";

const TEXTURE_SIZE = 256;

type TextSpriteArgs = {
  size?: number;
  fontSize?: string;
  font?: string;
};

class TextSprite {
  private z: number;
  private color: string;
  private fontSize: string;
  private font: string;
  private material: THREE.MeshBasicMaterial;
  private mesh: THREE.Mesh;

  constructor(
    text: string,
    color: string,
    z: number,
    args: TextSpriteArgs = {}
  ) {
    if (!args) {
      args = {};
    }

    this.z = z || 0;

    const size = args.size || TEXTURE_SIZE;

    this.color = color || "rgba(255,255,255,1)";

    this.fontSize = args.fontSize || "32px";
    this.font = args.font || "Arial Black";

    const canvas = abstractCanvas.create(size, size);
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.save();
    context.fillStyle = this.color;
    context.font = this.fontSize + " " + this.font;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.shadowColor = "rgba(0,0,0,1)";

    context.shadowBlur = 8;
    context.fillText(text, Math.round(size / 2), Math.round(size / 2));
    context.restore();

    const geometry = new THREE.PlaneGeometry(size, size, 1, 1);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
  }

  getMesh() {
    if (!this.mesh) {
      throw new Error("Mesh not created");
    }

    return this.mesh;
  }

  setScale(width: number, height: number) {
    this.mesh.scale.set(width, height, 1);
  }

  hide() {
    this.mesh.visible = false;
    return this;
  }

  show() {
    this.mesh.visible = true;
    return this;
  }

  setOpacity(opacity: number) {
    this.material.opacity = opacity;
  }

  setPosition(pos: IVector) {
    this.mesh.position.x = pos.x;
    this.mesh.position.y = pos.y;
    this.mesh.position.z = this.z;
    return this;
  }

  destroy() {
    //this.mesh.material.dispose();
  }
}

export default TextSprite;
