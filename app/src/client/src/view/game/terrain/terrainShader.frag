uniform vec3 lightDirection;
uniform vec3 baseColor;
uniform bool showHexGrid;
uniform sampler2D textureLookup;
uniform sampler2D hexCoordLookup;
uniform bool debugHexCoords;
uniform sampler2D groundTextureDiffuse;

varying vec3 vNormal;
varying float vDiscardFlag;
varying float vVertexType;
varying vec2 vUv;

// Texture atlas configuration
const float ATLAS_GRID_SIZE = 10.0; // 10x10 grid = 100 textures
const float HEX_GRID_SIZE = 34.0; // Total grid size including borders
const float BORDER_SIZE = 1.0; // 1 hex border on each edge
const float VISIBLE_GRID_SIZE = HEX_GRID_SIZE - 2.0 * BORDER_SIZE; // 32x32 visible hexes
const float TEXTURE_REPEAT = 8.0; // Number of times to repeat texture across hex
const float ATLAS_TILE_INSET = 0.5; // Pixel inset to prevent bleeding (in pixels)

// Texture tiling adjustment - tweak these to align textures across grids
const vec2 TEXTURE_UV_OFFSET = vec2(1.0/34.5, 1.0/25.75); 
const vec2 TEXTURE_UV_SCALE = vec2(34.5/32.0, 25.75/24.0); 

/**
 * Adjust UV coordinates to exclude the border hexes
 * Maps UV from [0,1] (full grid) to only the visible inner area
 * For flat-sided (pointy-topped) hexagons:
 * - Horizontal spacing (q direction) = HEX_SIZE * 1.5
 * - Vertical spacing (r direction) = HEX_SIZE * sqrt(3)
 * - Total mesh spans 34 hexes in both directions (from localQ/R = -1 to 32)
 */
vec2 adjustUVForBorder(vec2 uv) {
  // Adjust UV coordinates to exclude border hexes and align textures across grids
  // Subtract offset to move to start of visible area, then scale up
  vec2 adjustedUV = (uv - TEXTURE_UV_OFFSET) * TEXTURE_UV_SCALE;
  return adjustedUV;
}

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
  // Convert hex coordinates to pixel coordinates
  // hex (-1, -1) is at pixel (0, 0)
  // hex (q, r) is at pixel (q+1, r+1)
  float pixelX = hexCoord.x + 1.0;
  float pixelY = hexCoord.y + 1.0;

  // Convert pixel coordinates to UV (sample at pixel center)
  vec2 textureLookupUV = (vec2(pixelX, pixelY) + 0.5) / HEX_GRID_SIZE;

  // Sample the texture (texture ID is in red channel, normalized [0,1])
  vec4 textureSample = texture2D(textureLookup, textureLookupUV);

  // Convert from normalized [0,1] to [0,255] and round to nearest integer
  // Add 0.5 before floor to round to nearest instead of truncating
  float textureId = floor(textureSample.r * 255.0 + 0.5);

  // Clamp to valid range to handle any floating point precision issues
  return clamp(textureId, 0.0, 255.0);
}

/**
 * Sample color from texture atlas
 * The atlas contains multiple textures arranged in a grid
 * @param textureId - The texture ID (0 to ATLAS_GRID_SIZE² - 1)
 * @param uv - UV coordinates within the hex [0,1]
 * @returns RGB color from the texture atlas
 */
vec3 getColorFromTextureAtlas(float textureId, vec2 uv) {

 
  // Adjust UV to exclude border hexes for correct tiling across grid boundaries
  vec2 adjustedUV = adjustUVForBorder(uv);

  // Calculate which sub-texture to use in the grid
  float col = mod(textureId, ATLAS_GRID_SIZE);
  float row = floor(textureId / ATLAS_GRID_SIZE);

  // Repeat the texture coordinates
  vec2 repeatedUV = fract(adjustedUV * TEXTURE_REPEAT);

  // Calculate tile size
  float tileSize = 1.0 / ATLAS_GRID_SIZE;

  // Add small epsilon to prevent sampling at exact 1.0 boundary
  const float epsilon = 0.0001;
  repeatedUV = clamp(repeatedUV, epsilon, 1.0 - epsilon);

  // Scale UV coordinates to fit within one sub-texture
  vec2 scaledUV = repeatedUV * tileSize;

  // Calculate UV offset for this sub-texture
  // Flip Y-axis because texture atlas has (0,0) at top-left but OpenGL UV has (0,0) at bottom-left
  vec2 atlasOffset = vec2(col, ATLAS_GRID_SIZE - 1.0 - row) * tileSize;

  // Final UV coordinates in the atlas
  vec2 finalUV = atlasOffset + scaledUV;

  // Sample the texture atlas
  vec4 texColor = texture2D(groundTextureDiffuse, finalUV);

  if (vDiscardFlag > 0.0) {
    return mix(texColor.rgb, vec3(0.0, 0.0, 1.0),  0.5);
  }


  return texColor.rgb;
}

void main() {

  if (vDiscardFlag > 0.0) {
    discard;
  }

  vec3 normal = normalize(vNormal);
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
    // Get terrain color from texture atlas (using texture ID 0 for now)
    vec3 terrainColor = getColorFromTextureAtlas(1.0, vUv);

    // Apply lighting to terrain color
    float diffuse = max(dot(normal, lightDirection), 0.0);
    vec3 ambient = vec3(0.25, 0.25, 0.25);
    color = terrainColor * (ambient + diffuse * 0.75);
  }

  // Draw hex grid lines on top of base color
  if (showHexGrid) {
    float lineWidth = 0.025;
    float edgeFactor = smoothstep(lineWidth - 0.05, lineWidth + 0.05, vVertexType);

    vec3 lineColor = vec3(0.0, 0.0, 0.0); // Black lines
    if (edgeFactor < 0.5) {
      color = mix(lineColor, color, edgeFactor * 0.5);
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
