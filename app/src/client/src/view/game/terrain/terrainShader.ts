import * as THREE from "three";

export interface TerrainShaderUniforms {
  halfWidth: { value: number };
  halfHeight: { value: number };
  borderWidth: { value: number };
  borderHeight: { value: number };
  lightDirection: { value: THREE.Vector3 };
  baseColor: { value: THREE.Color };
}

export const createTerrainShaderMaterial = (
  planeWidth: number,
  planeHeight: number,
  borderWidth: number,
  borderHeight: number,
): THREE.ShaderMaterial => {
  const uniforms: TerrainShaderUniforms = {
    halfWidth: { value: planeWidth * 0.5 },
    halfHeight: { value: planeHeight * 0.5 },
    borderWidth: { value: borderWidth },
    borderHeight: { value: borderHeight },
    lightDirection: { value: new THREE.Vector3(0.5, 0.5, 1).normalize() },
    baseColor: { value: new THREE.Color(0x228b22) },
  };

  const vertexShader = `
    uniform float halfWidth;
    uniform float halfHeight;
    uniform float borderWidth;
    uniform float borderHeight;

    varying vec3 vNormal;
    varying float vDiscardFlag;

    void main() {
      vNormal = normalize(normalMatrix * normal);

      float distFromLeft = position.x + halfWidth;
      float distFromBottom = position.y + halfHeight;

      vDiscardFlag = ((distFromLeft < borderWidth) || (distFromBottom < borderHeight)) ? 1.0 : 0.0;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 lightDirection;
    uniform vec3 baseColor;

    varying vec3 vNormal;
    varying float vDiscardFlag;

    void main() {
      if (vDiscardFlag > 0.5) {
        discard;
      }

      vec3 normal = normalize(vNormal);

      float diffuse = max(dot(normal, lightDirection), 0.0);
      vec3 ambient = vec3(0.25, 0.25, 0.25);
      vec3 color = baseColor * (ambient + diffuse * 0.75);

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
