import * as THREE from "three";
import Sprite from "./Sprite";
import abstractCanvas from "../../utils/abstractCanvas";
import { drawCircleAndFill } from "../../utils/graphics";
import { spriteFragmentShader, spriteVertexShader } from "../shader";

const baseMaterial = new THREE.ShaderMaterial({
  vertexShader: spriteVertexShader,
  fragmentShader: spriteFragmentShader,
  transparent: true,
  depthWrite: false
  //blending: THREE.AdditiveBlending
});

let texture = new THREE.TextureLoader().load("/img/shipMapIcon.png");
let textureMovementTarget = new THREE.TextureLoader().load(
  "/img/shipMapIconMovementTarget.png"
);

class ShipMapSprite extends Sprite {
  constructor(position, size, z, opacity, movementTarget = false) {
    super(null, size, z);

    this.setOpacity(opacity);

    if (movementTarget) {
      this.uniforms.texture.value = textureMovementTarget;
    } else {
      this.uniforms.texture.value = texture;
    }
    this.setPosition(position);
  }

  getMaterial() {
    return baseMaterial;
  }
}

export default ShipMapSprite;
