uniform vec3 lightDirection;
uniform vec3 baseColor;
uniform bool showHexGrid;
uniform sampler2D textureLookup;
uniform sampler2D hexCoordLookup;
uniform sampler2D hexBlendingTexture;
uniform bool debugHexCoords;
uniform sampler2D groundTextureDiffuse;
uniform sampler2D groundTextureNormal;
uniform float time;

varying vec3 vNormal;
varying float vDiscardFlag;
varying float vVertexType;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vCubeCoord;

// Texture atlas configuration
const float ATLAS_GRID_SIZE = 5.0; // 10x10 grid = 100 textures
const float HEX_GRID_SIZE = 34.0; // Total grid size including borders
const float BORDER_SIZE = 1.0; // 1 hex border on each edge
const float VISIBLE_GRID_SIZE = HEX_GRID_SIZE - 2.0 * BORDER_SIZE; // 32x32 visible hexes
const float TEXTURE_REPEAT = 2.0; // Number of times to repeat texture across hex
const float NORMAL_MAP_STRENGTH = 0.5; // 0.0 = flat geometry, 1.0 = full normal map effect
const float BLEND_THRESHOLD = 0.3; // Blend textures when vVertexType < this value


const float TOTAL_HEX_GRID_WIDTH = HEX_GRID_SIZE + 0.5;
const float VISIBLE_HEXGRID_WIDTH = TOTAL_HEX_GRID_WIDTH - 2.5;

const float TOTAL_HEX_GRID_HEIGHT = HEX_GRID_SIZE * 0.75 + 0.25;
const float VISIBLE_HEXGRID_HEIGHT = TOTAL_HEX_GRID_HEIGHT - 1.75;

const vec3 DEPTH_COLOR = vec3(0.3, 0.4, 0.8);
const vec3 FINAL_DEPTH_COLOR = mix(vec3(0.0, 0.0, 0.0), DEPTH_COLOR, 0.1);


// Texture tiling adjustment - tweak these to align textures across grids
const vec2 TEXTURE_UV_OFFSET = vec2(1.0/TOTAL_HEX_GRID_WIDTH, 1.0/TOTAL_HEX_GRID_HEIGHT); 
const vec2 TEXTURE_UV_SCALE = vec2(TOTAL_HEX_GRID_WIDTH/VISIBLE_HEXGRID_WIDTH, TOTAL_HEX_GRID_HEIGHT/VISIBLE_HEXGRID_HEIGHT); 



 vec2 toHexOffsetCoordinate(vec3 cube) {
  float q = cube.x + (cube.z + float(int(cube.z) & 1)) / 2.0;
  float r = cube.z;

  return vec2(q, r); // EVEN_R
}

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
 * Get hex coordinates from interpolated cube coordinates
 * Returns vec2(q, r) offset coordinates
 * The interpolated cube coords maintain the constraint x+y+z=0
 */
vec2 getHexCoordFromCube(vec3 cubeCoord) {
  // Proper cube rounding algorithm that maintains x+y+z=0 constraint
  // Based on Cube.round() from JavaScript
  vec3 rounded = floor(cubeCoord + 0.5);

  // Calculate rounding errors
  vec3 diff = abs(rounded - cubeCoord);

  // Find which component has the largest rounding error
  // and recalculate it to maintain the constraint x+y+z=0
  if (diff.x > diff.y && diff.x > diff.z) {
    rounded.x = -rounded.y - rounded.z;
  } else if (diff.y > diff.z) {
    rounded.y = -rounded.x - rounded.z;
  } else {
    rounded.z = -rounded.x - rounded.y;
  }

  // Convert cube to offset coordinates using toHexOffsetCoordinate
  return toHexOffsetCoordinate(rounded);
}

/**
 * Calculate UV coordinates local to the current hex [0,1]
 * Converts fractional cube coordinates to hex-local UV space
 * For pointy-topped hexagons
 */
vec2 getLocalHexUV(vec3 cubeCoord) {
  // Round to find which hex we're in
  vec3 rounded = floor(cubeCoord + 0.5);

  // Apply cube rounding constraint
  vec3 diff = abs(rounded - cubeCoord);
  if (diff.x > diff.y && diff.x > diff.z) {
    rounded.x = -rounded.y - rounded.z;
  } else if (diff.y > diff.z) {
    rounded.y = -rounded.x - rounded.z;
  } else {
    rounded.z = -rounded.x - rounded.y;
  }

  // Offset from hex center in cube space
  vec3 offset = cubeCoord - rounded;

  // Convert from cube coordinates to 2D cartesian for pointy-topped hex
  // Cube coordinates are at 120° angles, we need to convert to rectangular
  // For pointy-topped hex:
  // x = sqrt(3) * q + sqrt(3)/2 * r
  // y = 3/2 * r
  const float SQRT3 = 1.732050808;
  float hexLocalX = SQRT3 * offset.x + (SQRT3 / 2.0) * offset.z;
  float hexLocalY = (3.0 / 2.0) * offset.z;

  // Normalize to [0, 1]
  // For pointy-topped hex:
  // - Width (flat to flat) = sqrt(3) * size, so hexLocalX ranges from [-sqrt(3)/2, sqrt(3)/2]
  // - Height (point to point) = 2 * size, so hexLocalY ranges from [-1, 1]
  float u = (hexLocalX / SQRT3) + 0.5; // Range: [-sqrt(3)/2, sqrt(3)/2] -> [0, 1]
  float v = (hexLocalY / 2.0) + 0.5;   // Range: [-1, 1] -> [0, 1]

  return vec2(u, v);
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

vec2 getTextureAtlasUvWithoutAdjust(float textureId, vec2 uv, float textureRepeat) {
  // Calculate which sub-texture to use in the grid
  float col = mod(textureId, ATLAS_GRID_SIZE);
  float row = floor(textureId / ATLAS_GRID_SIZE);

  // Repeat the texture coordinates
  vec2 repeatedUV = fract(uv * textureRepeat);

  // Calculate tile size
  float tileSize = 1.0 / ATLAS_GRID_SIZE;

  // Add small epsilon to prevent sampling at exact 1.0 boundary
  const float epsilon = 0.001;
  repeatedUV = clamp(repeatedUV, epsilon, 1.0 - epsilon);

  // Scale UV coordinates to fit within one sub-texture
  vec2 scaledUV = repeatedUV * tileSize;

  // Calculate UV offset for this sub-texture
  // Flip Y-axis because texture atlas has (0,0) at top-left but OpenGL UV has (0,0) at bottom-left
  vec2 atlasOffset = vec2(col, ATLAS_GRID_SIZE - 1.0 - row) * tileSize;

  // Final UV coordinates in the atlas
  return atlasOffset + scaledUV;
}

vec2 getTextureAtlasUv(float textureId, vec2 uv, float textureRepeat) {

  // Adjust UV to exclude border hexes for correct tiling across grid boundaries
  vec2 adjustedUV = adjustUVForBorder(uv);

   // Calculate which sub-texture to use in the grid
  float col = mod(textureId, ATLAS_GRID_SIZE);
  float row = floor(textureId / ATLAS_GRID_SIZE);

  // Repeat the texture coordinates
  vec2 repeatedUV = fract(adjustedUV * textureRepeat);

  // Calculate tile size
  float tileSize = 1.0 / ATLAS_GRID_SIZE;

  // Add small epsilon to prevent sampling at exact 1.0 boundary
  const float epsilon = 0.001;
  repeatedUV = clamp(repeatedUV, epsilon, 1.0 - epsilon);

  // Scale UV coordinates to fit within one sub-texture
  vec2 scaledUV = repeatedUV * tileSize;

  // Calculate UV offset for this sub-texture
  // Flip Y-axis because texture atlas has (0,0) at top-left but OpenGL UV has (0,0) at bottom-left
  vec2 atlasOffset = vec2(col, ATLAS_GRID_SIZE - 1.0 - row) * tileSize;

  // Final UV coordinates in the atlas
  return atlasOffset + scaledUV;
}
/**
 * Sample color from texture atlas
 * The atlas contains multiple textures arranged in a grid
 * @param textureId - The texture ID (0 to ATLAS_GRID_SIZE² - 1)
 * @param uv - UV coordinates within the hex [0,1]
 * @returns RGB color from the texture atlas
 */
vec3 getColorFromTextureAtlas(vec2 uv) {

  // Sample the texture atlas
  vec4 texColor = texture2D(groundTextureDiffuse, uv);

  if (vDiscardFlag > 0.0) {
    return mix(texColor.rgb, vec3(0.0, 0.0, 1.0),  0.5);
  }


  return texColor.rgb;
}

vec3 getNormalFromTextureAtlas(vec2 uv) {

  // Sample the texture atlas
  vec4 texColor = texture2D(groundTextureNormal, uv);

  return texColor.rgb;
}

/**
 * Calculate world-space normal from normal map texture
 * @param terrainNormal - Normal map color sampled from texture (in [0,1] range)
 * @param geometryNormal - Geometry normal from vertex shader
 * @param uv - UV coordinates for computing tangent space
 * @returns Normal vector in world space
 */
vec3 calculateNormalFromMap(vec3 terrainNormal, vec3 geometryNormal, vec2 uv) {
  // Convert normal map from [0,1] range to [-1,1] range
  vec3 normalMapNormal = terrainNormal * 2.0 - 1.0;

  // Flip Y if using DirectX-style normal map (uncomment to test)
  //normalMapNormal.y = -normalMapNormal.y;

  // Apply strength to normal map (lerp between flat and full normal map)
  normalMapNormal.xy *= NORMAL_MAP_STRENGTH;

  // Construct TBN matrix using screen-space derivatives
  vec3 geomNormal = normalize(geometryNormal);
  vec3 Q1 = dFdx(vec3(uv, 0.0));
  vec3 Q2 = dFdy(vec3(uv, 0.0));
  vec2 st1 = dFdx(uv);
  vec2 st2 = dFdy(uv);

  vec3 T = normalize(Q1 * st2.t - Q2 * st1.t);
  vec3 B = normalize(-Q1 * st2.s + Q2 * st1.s);
  mat3 TBN = mat3(T, B, geomNormal);

  // Transform normal from tangent space to world space
  return normalize(TBN * normalMapNormal);
}

/**
 * Apply depth-based darkening based on world Z coordinate
 * @param color - Original color
 * @param worldZ - World Z coordinate
 * @returns Color blended to black based on depth (Z < 100)
 */
vec3 applyDepthDarkening(vec3 color, vec3 depthColor, float minDepth, float maxDepth, float noiseStrength) {

  
  float normalizedTime = time; 

  const float animSpeed = 0.00001; // Adjust to control animation speed
  

  vec3 noiseColor1 = getColorFromTextureAtlas(getTextureAtlasUv(20.0, vUv + vec2(normalizedTime * animSpeed, normalizedTime * animSpeed * 0.7), TEXTURE_REPEAT));
  vec3 noiseColor2 = getColorFromTextureAtlas(getTextureAtlasUv(20.0, vUv - vec2(normalizedTime * animSpeed, normalizedTime * animSpeed * 0.7), TEXTURE_REPEAT));
  vec3 noiseColor = mix(noiseColor1, noiseColor2, 0.5);
  // Use noise to modulate worldZ for non-uniform depth effect
  float modulatedZ = vWorldPosition.z - (noiseColor.r) * noiseStrength;

 

  // Calculate blend factor: 0 at minDepth (black), 1 at maxDepth (original color)
  float depthFactor = clamp((modulatedZ - minDepth) / (maxDepth - minDepth), 0.0, 1.0);

  // Blend from black to original color
  return mix(depthColor, color, depthFactor);
}

/**
 * Get neighbor direction in cube coordinates from neighbor index (0-5)
 * Matches the neighbor mapping in HexBlendingTextureRenderer.ts
 */
vec3 getNeighborDirection(float neighborIndex) {
  // Map neighbor index to cube direction
  // 0: (+X, -Y, 0)
  // 1: (+X, 0, -Z)
  // 2: (0, +Y, -Z)
  // 3: (-X, +Y, 0)
  // 4: (-X, 0, +Z)
  // 5: (0, -Y, +Z)

  if (neighborIndex < 0.5) {
    return vec3(1.0, -1.0, 0.0);
  } else if (neighborIndex < 1.5) {
    return vec3(1.0, 0.0, -1.0);
  } else if (neighborIndex < 2.5) {
    return vec3(0.0, 1.0, -1.0);
  } else if (neighborIndex < 3.5) {
    return vec3(-1.0, 1.0, 0.0);
  } else if (neighborIndex < 4.5) {
    return vec3(-1.0, 0.0, 1.0);
  } else {
    return vec3(0.0, -1.0, 1.0);
  }
}

/**
 * Calculate UV coordinates local to a neighbor hex with scaling
 * @param cubeCoord - Current position in cube coordinates
 * @param neighborIndex - Which neighbor (0-5) to use as reference
 * @param scaling - How much the UVs extend beyond hex boundaries
 *                  scaling = 1.0: UV [0,1] covers exactly the neighbor hex
 *                  scaling = 2.0: UV [0,1] covers 2x the neighbor hex (overlap into surrounding hexes)
 * @returns UV coordinates [0,1] centered on the neighbor hex
 */
vec2 getScaledNeighborHexUV(vec3 cubeCoord, float neighborIndex, float scaling) {
  // Get the direction to the specified neighbor
  vec3 neighborDir = getNeighborDirection(neighborIndex);

  // Round to find which hex we're currently in
  vec3 rounded = floor(cubeCoord + 0.5);

  // Apply cube rounding constraint (maintain x+y+z=0)
  vec3 diff = abs(rounded - cubeCoord);
  if (diff.x > diff.y && diff.x > diff.z) {
    rounded.x = -rounded.y - rounded.z;
  } else if (diff.y > diff.z) {
    rounded.y = -rounded.x - rounded.z;
  } else {
    rounded.z = -rounded.x - rounded.y;
  }

  // Calculate the neighbor hex center in cube coordinates
  vec3 neighborCenter = rounded + neighborDir;

  // Calculate offset from the neighbor hex center
  vec3 offset = cubeCoord - neighborCenter;

  // Convert from cube coordinates to 2D cartesian for flat-sided hexagons
  // These formulas work for pointy-topped hex orientation
  const float SQRT3 = 1.732050808;
  float hexLocalX = SQRT3 * offset.x + (SQRT3 / 2.0) * offset.z;
  float hexLocalY = (3.0 / 2.0) * offset.z;

  // Normalize to [0, 1] with scaling factor
  // Larger scaling values cause UVs to extend further beyond the neighbor hex boundaries
  float u = (hexLocalX / SQRT3) / scaling + 0.5;
  float v = (hexLocalY / 2.0) / scaling + 0.5;

  return vec2(u, v);
}

/**
 * Blend textures using pre-computed hex blending texture
 * Uses the hexBlendingTexture to get weights and neighbor indices
 */
vec3 getBlendedTexture(vec2 uv, vec2 currentHexCoord, float currentTextureId, float edgeFactor) {
  // Get local hex UV coordinates [0, 1] within the current hex
  vec2 hexUV = getLocalHexUV(vCubeCoord);

  // Sample the hex blending texture
  // R: current hex weight
  // G: first neighbor weight
  // B: second neighbor weight
  // A: first neighbor index (0-5 encoded as 0-255)
  vec4 blendData = texture2D(hexBlendingTexture, hexUV);

  float currentWeight = blendData.r;
  float neighbor1Weight = blendData.g;
  float neighbor2Weight = blendData.b;
  float neighbor1Index = floor(blendData.a * 5.0 + 0.5); // Decode from [0,1] to [0,5]

  // If we're fully in the current hex (no blending), return early
  if (currentWeight > 0.99) {
    vec2 currentAtlasUv = getTextureAtlasUv(currentTextureId, uv, TEXTURE_REPEAT);
    return getColorFromTextureAtlas(currentAtlasUv);
  }

  // Round to find the current hex in cube coordinates
  vec3 rounded = floor(vCubeCoord + 0.5);
  vec3 diff = abs(rounded - vCubeCoord);
  if (diff.x > diff.y && diff.x > diff.z) {
    rounded.x = -rounded.y - rounded.z;
  } else if (diff.y > diff.z) {
    rounded.y = -rounded.x - rounded.z;
  } else {
    rounded.z = -rounded.x - rounded.y;
  }

  // Start with current hex color
  vec2 currentAtlasUv = getTextureAtlasUv(currentTextureId, uv, TEXTURE_REPEAT);
  vec3 blendedColor = getColorFromTextureAtlas(currentAtlasUv) * currentWeight;

  // Add first neighbor if weight is significant
  if (neighbor1Weight > 0.01) {
    vec3 neighbor1Dir = getNeighborDirection(neighbor1Index);
    vec3 neighbor1Cube = rounded + neighbor1Dir;
    vec2 neighbor1Coord = toHexOffsetCoordinate(neighbor1Cube);
    float neighbor1TextureId = getTextureIdFromHexCoord(neighbor1Coord);

    vec2 neighbor1AtlasUv = getTextureAtlasUv(neighbor1TextureId, uv, TEXTURE_REPEAT);
    blendedColor += getColorFromTextureAtlas(neighbor1AtlasUv) * neighbor1Weight;
  }

  // Add second neighbor if weight is significant
  if (neighbor2Weight > 0.01) {
    // For second neighbor, we need to determine direction based on offset
    // This is more complex - for now, blend with the perpendicular neighbor
    // We can determine this from the offset direction
    vec3 offset = vCubeCoord - rounded;
    vec3 neighbor1Dir = getNeighborDirection(neighbor1Index);

    // Find which axis is next most significant after the primary neighbor
    vec3 absOffset = abs(offset);
    vec3 neighbor2Dir = vec3(0.0);

    // Simple heuristic: try the other significant axes
    if (neighbor1Index < 0.5 || neighbor1Index > 4.5) {
      // X-axis neighbors, try Y or Z
      if (absOffset.y > absOffset.z) {
        neighbor2Dir = vec3(0.0, sign(offset.y), -sign(offset.y));
      } else {
        neighbor2Dir = vec3(-sign(offset.z), 0.0, sign(offset.z));
      }
    } else if (neighbor1Index < 2.5) {
      // Y-axis neighbors, try X or Z
      if (absOffset.x > absOffset.z) {
        neighbor2Dir = vec3(sign(offset.x), -sign(offset.x), 0.0);
      } else {
        neighbor2Dir = vec3(-sign(offset.z), 0.0, sign(offset.z));
      }
    } else {
      // Z-axis neighbors, try X or Y
      if (absOffset.x > absOffset.y) {
        neighbor2Dir = vec3(sign(offset.x), -sign(offset.x), 0.0);
      } else {
        neighbor2Dir = vec3(0.0, sign(offset.y), -sign(offset.y));
      }
    }

    vec3 neighbor2Cube = rounded + neighbor2Dir;
    vec2 neighbor2Coord = toHexOffsetCoordinate(neighbor2Cube);
    float neighbor2TextureId = getTextureIdFromHexCoord(neighbor2Coord);

    vec2 neighbor2AtlasUv = getTextureAtlasUv(neighbor2TextureId, uv, TEXTURE_REPEAT);
    blendedColor += getColorFromTextureAtlas(neighbor2AtlasUv) * neighbor2Weight;
  }

  return blendedColor;
}

void main() {

  if (vDiscardFlag > 0.0) {
    gl_FragColor = vec4(0.0, 0.0, 2.0, 1.0);
    return;
    discard;
  }


 vec2 hexUv = getLocalHexUV(vCubeCoord);


/*
  if (vWorldPosition.z < 1.0) {
    gl_FragColor = vec4(FINAL_DEPTH_COLOR, 1.0);
    return;
  }
  */




  vec2 hexCoord = getHexCoordFromCube(vCubeCoord);

   if (hexCoord.x == 14.0 && hexCoord.y == 7.0) { 
  
  if (hexUv.x < 0.001 || hexUv.x > 0.999 ) {
    gl_FragColor = vec4( 1.0);
    return;
  }

  if ( hexUv.y < 0.001 || hexUv.y > 0.999) {
    gl_FragColor = vec4(1.0);
    return;
  }
  

  gl_FragColor = vec4(0.0, hexUv.y, 0.0, 1.0);
  return;
 }
    

  if (hexCoord.x == 7.0 && hexCoord.y == 7.0) { 
    vec3 debugColor = texture2D(hexBlendingTexture, hexUv).rgb;
    gl_FragColor = vec4(debugColor.r, 0.0, 0.0, 1.0);
    return;
  }




  if (hexCoord.x == 12.0 && hexCoord.y == 7.0) { 
    
    vec3 debugColor = getColorFromTextureAtlas(getTextureAtlasUvWithoutAdjust(24.0, hexUv, 1.0));
    gl_FragColor = vec4(debugColor, 1.0);
    return;
  }

  float textureId = getTextureIdFromHexCoord(hexCoord);
  vec2 textureAtlasUv = getTextureAtlasUv(textureId, vUv, TEXTURE_REPEAT);
  vec3 terrainNormal = getNormalFromTextureAtlas(textureAtlasUv);

    if (hexCoord.x == 9.0 && hexCoord.y == 7.0) {
    float centerBlendingWeight = vVertexType;
    float noise =  1.0 + getColorFromTextureAtlas(getTextureAtlasUvWithoutAdjust(23.0, hexUv, 1.0)).r;

    vec3 baseColor = getColorFromTextureAtlas(textureAtlasUv);
    vec3 secondaryColor = vec3(1.0, 0.0, 0.0); //getColorFromTextureAtlas(getTextureAtlasUv(5.0, vUv, TEXTURE_REPEAT));

    centerBlendingWeight = centerBlendingWeight * noise;
    gl_FragColor = vec4(mix(baseColor, secondaryColor, centerBlendingWeight), 1.0);
    return;
  }

  // Calculate world-space normal from normal map
  vec3 normal = calculateNormalFromMap(terrainNormal, vNormal, vUv); //normalize(vNormal);

  vec3 color;

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
    // Get terrain color with blending at hex borders
    vec3 terrainColor = getBlendedTexture(vUv, hexCoord, textureId, vVertexType);

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

  // Apply depth-based darkening
  //color = applyDepthDarkening(color, DEPTH_COLOR, 1.0, 1000.0, 0.0);
  //color = applyDepthDarkening(color, FINAL_DEPTH_COLOR, 1.0, 500.0, 200.0);

  gl_FragColor = vec4(color, 1.0);
}
