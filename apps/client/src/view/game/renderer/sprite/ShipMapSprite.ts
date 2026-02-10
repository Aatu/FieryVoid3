import * as THREE from "three";
import Sprite from "./Sprite";
import { spriteFragmentShader, spriteVertexShader } from "../shader";
import { IVector } from "@fieryvoid3/model/src/utils/Vector";

const baseMaterial = new THREE.ShaderMaterial({
  vertexShader: spriteVertexShader,
  fragmentShader: spriteFragmentShader,
  transparent: true,
  depthWrite: false,
  //blending: THREE.AdditiveBlending
});

const texture = new THREE.TextureLoader().load("/img/shipMapIcon.png");
const textureMovementTarget = new THREE.TextureLoader().load(
  "/img/shipMapIconMovementTarget.png"
);

class ShipMapSprite extends Sprite {
  constructor(
    position: IVector,
    size: { width: number; height: number },
    z: number,
    opacity: number,
    movementTarget: boolean = false
  ) {
    super(null, size, z);

    this.setOpacity(opacity);

    if (movementTarget) {
      this.uniforms.uTexture.value = textureMovementTarget;
    } else {
      this.uniforms.uTexture.value = texture;
    }
    this.setPosition(position);
  }

  getMaterial() {
    return baseMaterial;
  }
}

export default ShipMapSprite;
