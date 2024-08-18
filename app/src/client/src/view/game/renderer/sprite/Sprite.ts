import * as THREE from "three";
import { spriteFragmentShader, spriteVertexShader } from "../shader";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";
import {
  degreeToRadian,
  radianToDegree,
} from "@fieryvoid3/model/src/utils/math";

const textureLoader = new THREE.TextureLoader();
const geometries: Record<string, THREE.PlaneGeometry> = {};

const baseMaterial = new THREE.ShaderMaterial({
  vertexShader: spriteVertexShader,
  fragmentShader: spriteFragmentShader,
  transparent: true,
  depthWrite: false,
});

class Sprite {
  protected mesh: THREE.Mesh | null;
  protected z: number;
  protected opacity: number;
  protected uniforms: {
    texture: { value: THREE.Texture };
    overlayAlpha: { value: number };
    overlayColor: { value: THREE.Color };
    opacity: { value: number };
  };
  protected color: THREE.Color | null;
  protected material: THREE.ShaderMaterial | null = null;

  constructor(
    image: string | THREE.Texture | null,
    size: { width: number; height: number },
    z: number
  ) {
    this.z = z || 0;
    this.mesh = null;
    this.opacity = 1;
    this.uniforms = {
      texture: { value: new THREE.DataTexture(null, 0, 0) },
      overlayAlpha: { value: 0.0 },
      overlayColor: { value: new THREE.Color(0, 0, 0) },
      opacity: { value: 1.0 },
    };

    this.color = null;

    this.mesh = this.create(size, image);
  }

  getMesh() {
    if (!this.mesh) {
      throw new Error("Mesh not created");
    }

    return this.mesh;
  }

  getMaterial() {
    return baseMaterial;
  }

  hide() {
    this.getMesh().visible = false;
    return this;
  }

  show() {
    this.getMesh().visible = true;
    return this;
  }

  replaceColor(color: THREE.Color) {
    this.uniforms.overlayColor.value = color;
    return this;
  }

  revertColor() {
    if (!this.color) {
      return;
    }

    this.uniforms.overlayColor.value = this.color;
  }

  setPosition(pos: IVector) {
    this.getMesh().position.x = pos.x;
    this.getMesh().position.y = pos.y;
    return this;
  }

  getPosition() {
    return this.getMesh().position;
  }

  isPosition(position: IVector) {
    return (
      this.getMesh().position.x === position.x &&
      this.getMesh().position.y === position.y &&
      this.getMesh().position.z === position.z
    );
  }

  setOpacity(opacity: number) {
    this.opacity = opacity;
    this.uniforms.opacity.value = opacity;
    return this;
  }

  multiplyOpacity(m: number) {
    this.uniforms.opacity.value = this.opacity * m;
    return this;
  }

  setOverlayColorAlpha(alpha: number) {
    this.uniforms.overlayAlpha.value = alpha;
    return this;
  }

  setOverlayColor(color: THREE.Color) {
    this.color = color;
    this.uniforms.overlayColor.value = color;
    return this;
  }

  isOverlayColor(color: { r: number; g: number; b: number }) {
    if (!this.color) {
      return false;
    }

    return (
      this.color.r === color.r &&
      this.color.g === color.g &&
      this.color.b === color.b
    );
  }

  setScale(width: number, height: number) {
    this.getMesh().scale.set(width, height, 1);
    return this;
  }

  destroy() {
    ([] as THREE.Material[])
      .concat(this.getMesh().material)
      .forEach((m) => m.dispose());
  }

  setFacing(facing: number) {
    this.getMesh().rotation.z = degreeToRadian(facing);
    return this;
  }

  getFacing() {
    return radianToDegree(this.getMesh().rotation.z);
  }

  create(
    size: { width: number; height: number },
    image: string | THREE.Texture | null
  ) {
    const material = this.getMaterial();
    const geometry =
      geometries["" + size.width + "-" + size.height] ||
      (() => {
        const geometry = new THREE.PlaneGeometry(size.width, size.height, 1, 1);
        geometries["" + size.width + "-" + size.height] = geometry;
        return geometry;
      })();

    if (typeof image == "string") {
      image = textureLoader.load("img/spritesheet.png");
    }

    if (image) {
      this.uniforms.texture.value = image;
    }

    this.material = material.clone();
    this.material.uniforms = this.uniforms;

    this.material.depthTest = true;

    const mesh = new THREE.Mesh(geometry, this.material);

    mesh.position.z = this.z;
    return mesh;
  }
}

export default Sprite;
