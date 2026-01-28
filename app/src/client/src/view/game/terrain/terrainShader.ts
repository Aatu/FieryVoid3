import * as THREE from "three";

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
    showHexGrid: { value: true },
    textureLookup: { value: null },
  };

  const vertexShader = `
    uniform float halfWidth;
    uniform float halfHeight;
    uniform float borderWidth;
    uniform float borderHeight;

    attribute float vertexType;
    attribute float borderFlag;

    varying vec3 vNormal;
    varying float vDiscardFlag;
    varying float vVertexType;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vVertexType = vertexType;

      // Use borderFlag to determine if this vertex is in a border hex
      vDiscardFlag = borderFlag;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 lightDirection;
    uniform vec3 baseColor;
    uniform bool showHexGrid;
    uniform sampler2D textureLookup;

    varying vec3 vNormal;
    varying float vDiscardFlag;
    varying float vVertexType;

    void main() {

      if (vDiscardFlag > 0.0) {
        discard;
      }

      vec3 normal = normalize(vNormal);

      vec3 terrainColor = vec3(0.13, 0.55, 0.13); // Default green

      // Apply lighting
      float diffuse = max(dot(normal, lightDirection), 0.0);
      vec3 ambient = vec3(0.25, 0.25, 0.25);
      vec3 color = terrainColor * (ambient + diffuse * 0.75);

      // Draw hex grid lines where vVertexType is low (near corners/edges)
      // vVertexType: 1.0 = center, 0.0 = corner
      // Use smoothstep for anti-aliased lines
      if (showHexGrid) {
        float lineWidth = 0.05;
        float edgeFactor = smoothstep(lineWidth - 0.05, lineWidth + 0.05, vVertexType);

        vec3 lineColor = vec3(0.0, 0.0, 0.0); // Black lines
        color = mix(lineColor, color, edgeFactor);
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide,
    wireframe: false,
  });
};
