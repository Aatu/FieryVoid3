import * as THREE from "three";
import coordinateConverter from "@fieryvoid3/model/src/utils/CoordinateConverter";
import { Offset } from "@fieryvoid3/model/src/hexagon";
import { HEX_SIZE } from "@fieryvoid3/model/src/config/gameConfig";

class HexGridLookupTextureRenderer {
  private textureCache: Map<string, THREE.DataTexture> = new Map();

  /**
   * Get corner positions of a hex in world space
   */
  private getHexCorners(centerX: number, centerY: number): { x: number; y: number }[] {
    const corners: { x: number; y: number }[] = [];
    // Flat-top hexagon corners (starting at 30 degrees)
    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i + 30;
      const angleRad = (Math.PI / 180) * angleDeg;
      corners.push({
        x: centerX + HEX_SIZE * Math.cos(angleRad),
        y: centerY + HEX_SIZE * Math.sin(angleRad),
      });
    }
    return corners;
  }

  /**
   * Generate a hex coordinate lookup texture
   * @param resolution - Texture resolution (width and height in pixels)
   * @param gridSize - Number of hexes in the grid (e.g., 32)
   * @returns DataTexture containing hex coordinates
   */
  generateTexture(resolution: number, gridSize: number): THREE.DataTexture {
    const cacheKey = `${resolution}_${gridSize}`;

    // Check cache first
    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey)!;
    }

    // Create texture data (RG format for q and r coordinates)
    const textureData = new Uint8Array(resolution * resolution * 2);

    // Grid spans from -1 to (gridSize + 1) in both dimensions (includes 1 border hex on each side)
    const localOffsetQ = -1;
    const localOffsetR = -1;
    const totalRange = gridSize + 2; // -1 to gridSize + 1
    const gridWidth = gridSize + 2;
    const gridHeight = gridSize + 2;

    // Calculate world space bounds the same way HexGeometry does
    // by tracking min/max of all vertices (centers and corners)
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let q = 0; q < gridWidth; q++) {
      for (let r = 0; r < gridHeight; r++) {
        const localQ = q + localOffsetQ;
        const localR = r + localOffsetR;
        const localHex = new Offset(localQ, localR);

        const centerLocal = coordinateConverter.fromHexToGame(localHex);

        // Track center
        minX = Math.min(minX, centerLocal.x);
        maxX = Math.max(maxX, centerLocal.x);
        minY = Math.min(minY, centerLocal.y);
        maxY = Math.max(maxY, centerLocal.y);

        // Track all corners
        const corners = this.getHexCorners(centerLocal.x, centerLocal.y);
        corners.forEach(corner => {
          minX = Math.min(minX, corner.x);
          maxX = Math.max(maxX, corner.x);
          minY = Math.min(minY, corner.y);
          maxY = Math.max(maxY, corner.y);
        });
      }
    }

    const worldWidth = maxX - minX;
    const worldHeight = maxY - minY;

    // For each pixel in the texture
    for (let py = 0; py < resolution; py++) {
      for (let px = 0; px < resolution; px++) {
        // Convert pixel coordinates to UV [0, 1]
        const u = px / (resolution - 1);
        const v = py / (resolution - 1);

        // Convert UV to world space coordinates
        const worldX = minX + u * worldWidth;
        const worldY = minY + v * worldHeight;

        // Convert world coordinates to hex coordinates
        const hexCoord = coordinateConverter.fromGameToHex({
          x: worldX,
          y: worldY,
          z: 0,
        });

        // Map hex coordinates to [0, 255] range
        // q and r range from -1 to (gridSize + 1), so range is totalRange
        const qNormalized = (hexCoord.q - localOffsetQ) / totalRange;
        const rNormalized = (hexCoord.r - localOffsetR) / totalRange;

        const qByte = Math.floor(qNormalized * 255);
        const rByte = Math.floor(rNormalized * 255);

        // Store in texture (RG format)
        const index = (py * resolution + px) * 2;
        textureData[index] = Math.max(0, Math.min(255, qByte)); // R = q
        textureData[index + 1] = Math.max(0, Math.min(255, rByte)); // G = r
      }
    }

    // Create DataTexture
    const texture = new THREE.DataTexture(
      textureData,
      resolution,
      resolution,
      THREE.RGFormat,
      THREE.UnsignedByteType,
    );

    texture.needsUpdate = true;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    // Cache the texture
    this.textureCache.set(cacheKey, texture);

    return texture;
  }

  /**
   * Clear all cached textures
   */
  dispose() {
    this.textureCache.forEach((texture) => texture.dispose());
    this.textureCache.clear();
  }
}

export default HexGridLookupTextureRenderer;
