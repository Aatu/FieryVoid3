uniform vec3 lightDirection;
uniform vec3 baseColor;
uniform bool showHexGrid;
uniform sampler2D textureLookup;
uniform sampler2D hexCoordLookup;
uniform bool debugHexCoords;

varying vec3 vNormal;
varying float vDiscardFlag;
varying float vVertexType;
varying vec2 vUv;

/**
 * Get hex coordinates from UV coordinates using the lookup texture
 * Returns vec2(q, r) hex coordinates
 */
vec2 getHexCoordFromUV(vec2 uv) {
  vec4 hexCoords = texture2D(hexCoordLookup, uv);

  // Convert normalized texture values back to hex coordinates
  // gridSize = 32, totalRange = gridSize + 2 = 34
  // Original formula: qNormalized = (q - (-1)) / 34 = (q + 1) / 34
  const float totalRange = 34.0;
  float qFloat = hexCoords.r * totalRange - 1.0;
  float rFloat = hexCoords.g * totalRange - 1.0;

  // Round to nearest integer
  float q = floor(qFloat + 0.5);
  float r = floor(rFloat + 0.5);

  return vec2(q, r);
}

/**
 * Get texture ID for a hex coordinate from the textureLookup texture
 * The textureLookup is a 34x34 grid where pixel (q+1, r+1) corresponds to hex (q, r)
 * Returns the texture ID (0-255) as an integer
 */
float getTextureIdFromHexCoord(vec2 hexCoord) {
  const float textureSize = 34.0;

  // Convert hex coordinates to pixel coordinates
  // hex (-1, -1) is at pixel (0, 0)
  // hex (q, r) is at pixel (q+1, r+1)
  float pixelX = hexCoord.x + 1.0;
  float pixelY = hexCoord.y + 1.0;

  // Convert pixel coordinates to UV (sample at pixel center)
  vec2 textureLookupUV = (vec2(pixelX, pixelY) + 0.5) / textureSize;

  // Sample the texture (texture ID is in red channel, normalized [0,1])
  vec4 textureSample = texture2D(textureLookup, textureLookupUV);

  // Convert from normalized [0,1] to [0,255] and round to nearest integer
  // Add 0.5 before floor to round to nearest instead of truncating
  float textureId = floor(textureSample.r * 255.0 + 0.5);

  // Clamp to valid range to handle any floating point precision issues
  return clamp(textureId, 0.0, 255.0);
}

void main() {

  if (vDiscardFlag > 0.0) {
    discard;
  }

  vec3 normal = normalize(vNormal);

  vec3 terrainColor = vec3(0.13, 0.55, 0.13); // Default green
  vec3 color;

  /*
  if (vUv.x < 0.001 || vUv.x > 0.999 || vUv.y < 0.001 || vUv.y > 0.999) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    return;
  }
    */

  vec2 hexCoord = getHexCoordFromUV(vUv);

  float textureId = getTextureIdFromHexCoord(hexCoord);

  // DEBUG: Visualize hex coordinate lookup texture
  if (debugHexCoords) {
    float q = hexCoord.x;
    float r = hexCoord.y;


      // Normalize q and r back to [0, 1] for visualization
      // q and r range from -1 to (gridSize + 1) = -1 to 33
      const float totalRange = 34.0;
      float qNormalized = (q + 1.0) / totalRange;
      float rNormalized = (r + 1.0) / totalRange;

      // Display q (red) and r (green) as color
      color = vec3(qNormalized, rNormalized, 0.0);

  } else {
    // Apply lighting to terrain color
    float diffuse = max(dot(normal, lightDirection), 0.0);
    vec3 ambient = vec3(0.25, 0.25, 0.25);
    color = terrainColor * (ambient + diffuse * 0.75);
  }

  // Draw hex grid lines on top of base color
  if (showHexGrid) {
    float lineWidth = 0.05;
    float edgeFactor = smoothstep(lineWidth - 0.05, lineWidth + 0.05, vVertexType);

    vec3 lineColor = vec3(0.0, 0.0, 0.0); // Black lines
    color = mix(lineColor, color, edgeFactor);
  }

  gl_FragColor = vec4(color, 1.0);
}
