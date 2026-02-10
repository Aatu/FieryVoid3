import * as THREE from "three";
import {
  effectSpriteFragmentShader,
  effectSpriteVertexShader,
} from "../shader";
import Vector, { IVector } from "@fieryvoid3/model/src/utils/Vector";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";
import {
  degreeToRadian,
  radianToDegree,
} from "@fieryvoid3/model/src/utils/math";

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/img/effect/effectTextures1024.png");

type Args = {
  activationTime?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  fadeOutTime?: number;
  blending?: THREE.Blending;
  scale?: { width: number; height: number };
  position?: Vector;
  texture?: number;
  color?: THREE.Color;
  opacity?: number;
  scaleChange?: number | null;
};

class EffecSprite {
  private activationTime: number;
  private fadeInDuration: number;
  private fadeOutDuration: number;
  private fadeOutTime: number | null;
  private blending: THREE.Blending;
  private scale: { width: number; height: number };
  private position: THREE.Vector3;
  private textureNumber: number;
  private color: THREE.Color;
  private opacity: number;
  private scaleChange: number | null;
  private mesh: THREE.Mesh | null;
  private scene: THREE.Object3D;
  private uniforms: {
    texture: { value: THREE.Texture };
    overlayColor: { value: THREE.Color };
    opacity: { value: number };
    textureNumber: { value: number };
  };
  private material: THREE.ShaderMaterial | null = null;

  constructor(scene: THREE.Object3D, args: Args = {}) {
    this.activationTime = args.activationTime || 0;
    this.fadeInDuration = args.fadeInDuration || 0;
    this.fadeOutDuration = args.fadeOutDuration || 0;
    this.fadeOutTime = args.fadeOutTime || null;
    this.blending = args.blending || THREE.AdditiveBlending;
    this.scale = args.scale || { width: 1, height: 1 };
    this.position = args?.position?.toThree() || new THREE.Vector3(0, 0, 0);
    this.textureNumber = args.texture || 0;
    this.color = args.color || new THREE.Color(1, 1, 1);
    this.opacity = args.opacity || 1.0;
    this.scaleChange = args.scaleChange || null;

    this.mesh = null;
    this.scene = scene;

    this.uniforms = {
      texture: {
        value: texture,
      },
      overlayColor: { value: this.color },
      opacity: { value: 1.0 },
      textureNumber: { value: this.textureNumber },
    };

    this.mesh = this.create();
    this.setPosition(this.position);
    this.setScale(this.scale.width, this.scale.height);
  }

  getMesh() {
    if (!this.mesh) {
      throw new Error("Mesh not created");
    }

    return this.mesh;
  }

  getOpacity(total: number) {
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

  render({ total }: RenderPayload) {
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

  setTexture(tex: number) {
    this.uniforms.textureNumber.value = tex;
    return this;
  }

  hide() {
    this.getMesh().visible = false;
    return this;
  }

  show() {
    this.getMesh().visible = true;
    return this;
  }

  setPosition(pos: IVector) {
    this.getMesh().position.x = pos.x;
    this.getMesh().position.y = pos.y;
    this.getMesh().position.z = pos.z;
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
    this.uniforms.opacity.value = opacity * this.opacity;
    return this;
  }

  multiplyOpacity(m: number) {
    this.uniforms.opacity.value = this.opacity * m;
    return this;
  }

  setColor(color: THREE.Color) {
    this.color = color;
    this.uniforms.overlayColor.value = color;
    return this;
  }

  setScale(width: number, height: number) {
    this.getMesh().scale.set(width, height, 1);
    return this;
  }

  destroy() {
    ([] as THREE.Material[])
      .concat(this.getMesh().material)
      .forEach((m) => m.dispose());

    if (this.mesh) this.scene.remove(this.mesh);
  }

  setFacing(facing: number) {
    this.getMesh().rotation.z = degreeToRadian(facing);
    return this;
  }

  getFacing() {
    return radianToDegree(this.getMesh().rotation.z);
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
