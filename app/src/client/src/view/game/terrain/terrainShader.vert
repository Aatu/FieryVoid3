uniform float halfWidth;
uniform float halfHeight;
uniform float borderWidth;
uniform float borderHeight;

attribute float vertexType;
attribute float borderFlag;

varying vec3 vNormal;
varying float vDiscardFlag;
varying float vVertexType;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vVertexType = vertexType;
  vUv = uv;

  // Calculate world position
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  // Use borderFlag to determine if this vertex is in a border hex
  vDiscardFlag = borderFlag;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
