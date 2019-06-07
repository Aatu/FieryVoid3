import Sprite from "./Sprite";
import * as THREE from "three";
import HexagonTexture from "../hexgrid/HexagonTexture";
import HexagonMath from "../../../../../model/utils/HexagonMath";

const TEXTURE_SIZE = 512;
let TEXTURE = null;

const createTexture = () => {
  const canvas = HexagonTexture.renderHexGrid(
    TEXTURE_SIZE,
    getStrokeColor(),
    getFillColor(),
    10
  );

  const tex = new THREE.Texture(canvas);
  tex.needsUpdate = true;
  TEXTURE = tex;
};

const getStrokeColor = () => {
  return "rgba(255,255,255,0.50)";
};

const getFillColor = () => {
  return "rgba(255,255,255,0.15)";
};

class HexagonSprite extends Sprite {
  constructor(position, z = 0, scale = 1) {
    super(
      null,
      {
        width: HexagonMath.getTextureWidth() * scale,
        height: HexagonMath.getTextureHeight() * scale
      },
      z
    );

    if (!TEXTURE) {
      createTexture();
    }

    this.uniforms.texture.value = TEXTURE;

    this.setPosition(position);
  }
}

export default HexagonSprite;
