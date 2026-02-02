import * as THREE from "three";
import vertexShader from "./terrainShader.vert?raw";
import fragmentShader from "./terrainShader.frag?raw";

// Load ground texture
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load(
  "/img/texture/ground/groundTexture.png",
);
// Use ClampToEdge for texture atlases to prevent wrapping artifacts
groundTexture.wrapS = THREE.ClampToEdgeWrapping;
groundTexture.wrapT = THREE.ClampToEdgeWrapping;
// Disable mipmapping to prevent bleeding between atlas tiles
groundTexture.minFilter = THREE.LinearFilter;
groundTexture.magFilter = THREE.LinearFilter;

const groundNormalMap = textureLoader.load(
  "/img/texture/ground/groundNormalMap.png",
);
groundNormalMap.wrapS = THREE.ClampToEdgeWrapping;
groundNormalMap.wrapT = THREE.ClampToEdgeWrapping;
groundNormalMap.minFilter = THREE.LinearFilter;
groundNormalMap.magFilter = THREE.LinearFilter;

export interface TerrainShaderUniforms {
  [uniform: string]: THREE.IUniform;
  halfWidth: { value: number };
  halfHeight: { value: number };
  borderWidth: { value: number };
  borderHeight: { value: number };
  lightDirection: { value: THREE.Vector3 };
  baseColor: { value: THREE.Color };
  showHexGrid: { value: boolean };
  textureLookup: { value: THREE.DataTexture | null };
  hexCoordLookup: { value: THREE.DataTexture | null };
  hexBlendingTexture: { value: THREE.DataTexture | null };
  debugHexCoords: { value: boolean };
  groundTextureDiffuse: { value: THREE.Texture | null };
  groundTextureNormal: { value: THREE.Texture | null };
  time: { value: number };
}

export const createTerrainShaderMaterial = (
  planeWidth: number,
  planeHeight: number,
  borderWidth: number,
  borderHeight: number,
  gridX: number = 0,
  gridY: number = 0,
  debug: boolean = false,
): THREE.ShaderMaterial => {
  // Generate unique color for debug mode based on grid position
  let color: THREE.Color;
  if (debug) {
    // Use grid coordinates to generate a unique hue
    const hue = (gridX * 0.618033988749895 + gridY * 0.381966011250105) % 1.0;
    const saturation = 0.7;
    const lightness = 0.5;
    color = new THREE.Color().setHSL(hue, saturation, lightness);
  } else {
    color = new THREE.Color(0x228b22); // Default green
  }

  const uniforms: TerrainShaderUniforms = {
    halfWidth: { value: planeWidth * 0.5 },
    halfHeight: { value: planeHeight * 0.5 },
    borderWidth: { value: borderWidth },
    borderHeight: { value: borderHeight },
    lightDirection: { value: new THREE.Vector3(0.5, 0.5, 1).normalize() },
    baseColor: { value: color },
    showHexGrid: { value: false },
    textureLookup: { value: null },
    hexCoordLookup: { value: null },
    hexBlendingTexture: { value: null },
    debugHexCoords: { value: false },
    groundTextureDiffuse: { value: groundTexture },
    groundTextureNormal: { value: groundNormalMap },
    time: { value: 0 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide,
    wireframe: false,
  });
};
