import * as THREE from "three";
import { spriteFragmentShader, spriteVertexShader } from "../shader";
import {
  degreeToRadian,
  radianToDegree
} from "../../../../../model/utils/math";

const textureLoader = new THREE.TextureLoader();
const geometries = {};

const baseMaterial = new THREE.ShaderMaterial({
  vertexShader: spriteVertexShader,
  fragmentShader: spriteFragmentShader,
  transparent: true,
  depthWrite: false
});

class Sprite {
  constructor(image, size, z) {
    this.z = z || 0;
    this.mesh = null;
    this.size = size;
    this.opacity = 1;
    this.uniforms = {
      texture: { type: "t", value: new THREE.DataTexture(null, 0, 0) },
      overlayAlpha: { type: "f", value: 0.0 },
      overlayColor: { type: "v3", value: new THREE.Color(0, 0, 0) },
      opacity: { type: "f", value: 1.0 }
    };

    this.color = null;

    this.mesh = this.create(size, image);
  }

  getMaterial() {
    return baseMaterial;
  }

  hide() {
    this.mesh.visible = false;
    return this;
  }

  show() {
    this.mesh.visible = true;
    return this;
  }

  replaceColor(color) {
    this.uniforms.overlayColor.value = color;
    return this;
  }

  revertColor() {
    if (!this.color) {
      return;
    }

    this.uniforms.overlayColor.value = this.color;
  }

  setPosition(pos) {
    this.mesh.position.x = pos.x;
    this.mesh.position.y = pos.y;
    return this;
  }

  getPosition() {
    return this.mesh.position;
  }

  isPosition(position) {
    return (
      this.mesh.position.x === position.x &&
      this.mesh.position.y === position.y &&
      this.mesh.position.z === position.z
    );
  }

  setOpacity(opacity) {
    this.opacity = opacity;
    this.uniforms.opacity.value = opacity;
    return this;
  }

  multiplyOpacity(m) {
    this.uniforms.opacity.value = this.opacity * m;
    return this;
  }

  setOverlayColorAlpha(alpha) {
    this.uniforms.overlayAlpha.value = alpha;
    return this;
  }

  setOverlayColor(color) {
    this.color = color;
    this.uniforms.overlayColor.value = color;
    return this;
  }

  isOverlayColor(color) {
    return (
      this.color.r === color.r &&
      this.color.g === color.g &&
      this.color.b === color.b
    );
  }

  setScale(width, height) {
    this.mesh.scale.set(width, height, 1);
    return this;
  }

  destroy() {
    this.mesh.material.dispose();
  }

  setFacing(facing) {
    this.mesh.rotation.z = degreeToRadian(facing);
    return this;
  }

  getFacing() {
    return radianToDegree(this.mesh.rotation.z);
  }

  create(size, image) {
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

    this.uniforms.texture.value = image;

    this.material = material.clone();
    this.material.uniforms = this.uniforms;

    this.material.depthTest = true;

    const mesh = new THREE.Mesh(geometry, this.material);

    mesh.position.z = this.z;
    return mesh;
  }
}

export default Sprite;
