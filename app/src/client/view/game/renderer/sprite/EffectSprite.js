import * as THREE from "three";
import {
  effectSpriteFragmentShader,
  effectSpriteVertexShader,
} from "../shader";
import {
  degreeToRadian,
  radianToDegree,
} from "../../../../../model/utils/math";

export const TEXTURE_GAS = 0;
export const TEXTURE_BOLT = 1;
export const TEXTURE_GLOW = 2;
export const TEXTURE_RING = 3;
export const TEXTURE_STARLINE = 4;
export const TEXTURE_FILLED_RING = 5;

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/img/effect/effectTextures1024.png");

class EffecSprite {
  constructor(scene, args = {}) {
    this.activationTime = args.activationTime || 0;
    this.fadeInDuration = args.fadeInDuration || 0;
    this.fadeOutDuration = args.fadeOutDuration || 0;
    this.fadeOutTime = args.fadeOutTime || null;
    this.blending = args.blending || THREE.AdditiveBlending;
    this.scale = args.scale || { width: 1, height: 1 };
    this.position = args.position.toThree() || THREE.Vector3(0, 0, 0);
    this.textureNumber = args.texture || 0;
    this.color = args.color || new THREE.Color(1, 1, 1);
    this.opacity = args.opacity || 1.0;
    this.scaleChange = args.scaleChange || null;

    this.mesh = null;
    this.scene = scene;

    this.uniforms = {
      texture: {
        type: "t",
        value: texture,
      },
      overlayColor: { type: "v3", value: this.color },
      opacity: { type: "f", value: 1.0 },
      textureNumber: { type: "f", value: this.textureNumber },
    };

    this.mesh = this.create();
    this.setPosition(this.position);
    this.setScale(this.scale.width, this.scale.height);
  }

  getOpacity(total) {
    if (
      this.fadeOutTime !== null &&
      total >= this.activationTime + this.fadeOutTime + this.fadeOutDuration
    ) {
      return 0.0;
    }

    if (
      this.fadeOutTime !== null &&
      total > this.activationTime + this.fadeOutTime &&
      total < this.activationTime + this.fadeOutTime + this.fadeOutDuration
    ) {
      return (
        (this.activationTime +
          this.fadeOutTime +
          this.fadeOutDuration -
          total) /
        this.fadeOutDuration
      );
    }

    if (total > this.activationTime + this.fadeInDuration) {
      return 1.0;
    }

    if (
      total > this.activationTime &&
      total < this.activationTime + this.fadeInDuration
    ) {
      return (
        1 -
        (this.activationTime + this.fadeInDuration - total) /
          this.fadeInDuration
      );
    }

    return 0;
  }

  render({ total }) {
    if (this.activationTime > total) {
      this.hide();
      return;
    }

    const activeTime = total - this.activationTime;

    const opacity = this.getOpacity(total);

    if (opacity === 0) {
      this.hide();
      return;
    }

    this.setOpacity(opacity);

    if (this.scaleChange !== null) {
      this.setScale(
        this.scale.width * this.scaleChange * activeTime,
        this.scale.height * this.scaleChange * activeTime
      );
    }

    this.show();
  }

  setTexture(tex) {
    this.uniforms.textureNumber.value = tex;
    return this;
  }

  hide() {
    this.mesh.visible = false;
    return this;
  }

  show() {
    this.mesh.visible = true;
    return this;
  }

  setPosition(pos) {
    this.mesh.position.x = pos.x;
    this.mesh.position.y = pos.y;
    this.mesh.position.z = pos.z;
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
    this.uniforms.opacity.value = opacity * this.opacity;
    return this;
  }

  multiplyOpacity(m) {
    this.uniforms.opacity.value = this.opacity * m;
    return this;
  }

  setColor(color) {
    this.color = color;
    this.uniforms.overlayColor.value = color;
    return this;
  }

  setScale(width, height) {
    this.mesh.scale.set(width, height, 1);
    return this;
  }

  destroy() {
    this.mesh.material.dispose();
    this.scene.remove(this.mesh);
  }

  setFacing(facing) {
    this.mesh.rotation.z = degreeToRadian(facing);
    return this;
  }

  getFacing() {
    return radianToDegree(this.mesh.rotation.z);
  }

  create() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: effectSpriteVertexShader,
      fragmentShader: effectSpriteFragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: this.blending,
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.material.uniforms = this.uniforms;

    const mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(mesh);
    return mesh;
  }
}

export default EffecSprite;
