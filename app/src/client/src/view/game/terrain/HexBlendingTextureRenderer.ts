import * as THREE from "three";
import { HEX_SIZE } from "@fieryvoid3/model/src/config/gameConfig";

/**
 * Generates a blending weight texture for a single pointy-topped hexagon
 * R: Weight for current hex
 * G: Weight for first neighbor
 * B: Weight for second neighbor
 * A: Index of first neighbor (0-5), encoded as 0-255
 */
class HexBlendingTextureRenderer {
  private textureCache: Map<number, THREE.DataTexture> = new Map();

  /**
   * Convert game coordinates to fractional cube coordinates
   * Rotated 30 degrees so cube axes align with hex corners instead of edges
   */
  private gameToCubeFractional(
    x: number,
    y: number,
    hexSize: number,
  ): { x: number; y: number; z: number } {
    // First rotate the coordinates by -30 degrees
    const cos30 = Math.sqrt(3) / 2;
    const sin30 = 0.5;
    const xRot = x * cos30 + y * sin30;
    const yRot = -x * sin30 + y * cos30;

    // Then convert to cube coordinates
    const q = ((1 / 3) * Math.sqrt(3) * xRot - (1 / 3) * yRot) / hexSize;
    const r = ((2 / 3) * yRot) / hexSize;

    const cubeX = q;
    const cubeZ = r;
    const cubeY = -cubeX - cubeZ;

    return { x: cubeX, y: cubeY, z: cubeZ };
  }

  /**
   * Round cube coordinates with constraint x+y+z=0
   */
  private roundCube(cube: {
    x: number;
    y: number;
    z: number;
  }): { x: number; y: number; z: number } {
    let rx = Math.round(cube.x);
    let ry = Math.round(cube.y);
    let rz = Math.round(cube.z);

    const xDiff = Math.abs(rx - cube.x);
    const yDiff = Math.abs(ry - cube.y);
    const zDiff = Math.abs(rz - cube.z);

    if (xDiff > yDiff && xDiff > zDiff) {
      rx = -ry - rz;
    } else if (yDiff > zDiff) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }

    return { x: rx, y: ry, z: rz };
  }

  /**
   * Calculate blending weights for a position within a hex
   * threshold: distance from center where blending starts (0-0.5)
   * At edge (distance = 0.5), current weight should be 0.5
   */
  private calculateBlendWeights(
    offset: { x: number; y: number; z: number },
    threshold: number,
  ): {
    currentWeight: number;
    neighbor1Weight: number;
    neighbor2Weight: number;
    neighbor1Index: number;
  } {
    // Distance from center (cube distance)
    // Clamp to 0.5 to ensure hex corners/edges don't exceed boundary
    const distFromCenter = Math.min(
      0.5,
      Math.max(
        Math.abs(offset.x),
        Math.abs(offset.y),
        Math.abs(offset.z),
      ),
    );

    // Close to center - only current hex
    if (distFromCenter < threshold) {
      return {
        currentWeight: 1.0,
        neighbor1Weight: 0.0,
        neighbor2Weight: 0.0,
        neighbor1Index: 0,
      };
    }

    // Current hex weight: maps from threshold→1.0, edge/corner(0.5)→0.5
    // Linear interpolation from [threshold, 0.5] to [1.0, 0.5]
    const blendRange = 0.5 - threshold;
    const blendFactor = (distFromCenter - threshold) / blendRange;
    const currentWeight = 1.0 - 0.5 * blendFactor;

    // Determine which neighbors to blend based on offset direction
    const absOffset = {
      x: Math.abs(offset.x),
      y: Math.abs(offset.y),
      z: Math.abs(offset.z),
    };

    // Map offset direction to neighbor index (0-5)
    // Neighbors: 0:(+X,-Y,0), 1:(+X,0,-Z), 2:(0,+Y,-Z), 3:(-X,+Y,0), 4:(-X,0,+Z), 5:(0,-Y,+Z)
    let neighbor1Index = 0;

    // Determine primary neighbor based on which axis has the largest offset
    if (absOffset.x >= absOffset.y && absOffset.x >= absOffset.z) {
      // X-axis is dominant
      neighbor1Index = offset.x > 0 ? 0 : 3;
    } else if (absOffset.y >= absOffset.x && absOffset.y >= absOffset.z) {
      // Y-axis is dominant
      neighbor1Index = offset.y > 0 ? 2 : 5;
    } else {
      // Z-axis is dominant
      neighbor1Index = offset.z > 0 ? 4 : 1;
    }

    // Calculate neighbor weights based on how close we are to edges/corners
    // The remaining weight (1.0 - currentWeight) is distributed among neighbors
    const remainingWeight = 1.0 - currentWeight;

    // Normalized axis weights for distributing among neighbors
    const sumOffset = absOffset.x + absOffset.y + absOffset.z;
    const axisWeights = {
      x: absOffset.x / sumOffset,
      y: absOffset.y / sumOffset,
      z: absOffset.z / sumOffset,
    };

    // Find the two largest axis weights for neighbor blending
    const sortedWeights = [
      { weight: axisWeights.x, axis: 'x' },
      { weight: axisWeights.y, axis: 'y' },
      { weight: axisWeights.z, axis: 'z' },
    ].sort((a, b) => b.weight - a.weight);

    const neighbor1Weight = remainingWeight * sortedWeights[0].weight;
    const neighbor2Weight = remainingWeight * sortedWeights[1].weight;

    return {
      currentWeight,
      neighbor1Weight,
      neighbor2Weight,
      neighbor1Index,
    };
  }

  /**
   * Generate hex blending texture
   * @param resolution - Texture resolution (width and height in pixels)
   * @param blendThreshold - Threshold for blending (0-0.5), default 0.3
   * @returns DataTexture containing blending weights
   */
  generateTexture(resolution: number = 256, blendThreshold: number = 0.3): THREE.DataTexture {
    const cacheKey = resolution;

    // Check cache
    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey)!;
    }

    // Create RGBA texture data
    const textureData = new Uint8Array(resolution * resolution * 4);

    // Pointy-topped hex dimensions (centered at origin)
    // Width (flat to flat) = sqrt(3) * HEX_SIZE
    // Height (point to point) = 2 * HEX_SIZE
    const hexWidth = Math.sqrt(3) * HEX_SIZE;
    const hexHeight = 2 * HEX_SIZE;

    // For each pixel
    for (let py = 0; py < resolution; py++) {
      for (let px = 0; px < resolution; px++) {
        // Convert pixel to normalized coordinates [0, 1]
        const u = px / (resolution - 1);
        const v = py / (resolution - 1);

        // Convert to centered coordinates using actual hex dimensions
        // x ranges from -hexWidth/2 to +hexWidth/2
        // y ranges from -hexHeight/2 to +hexHeight/2
        const x = (u - 0.5) * hexWidth;
        const y = (v - 0.5) * hexHeight;

        // Convert to cube coordinates
        const cube = this.gameToCubeFractional(x, y, HEX_SIZE);
        const rounded = this.roundCube(cube);

        // Offset from hex center
        const offset = {
          x: cube.x - rounded.x,
          y: cube.y - rounded.y,
          z: cube.z - rounded.z,
        };

        // Calculate blend weights
        const blend = this.calculateBlendWeights(offset, blendThreshold);

        // Encode in RGBA
        const index = (py * resolution + px) * 4;
        textureData[index] = Math.floor(blend.currentWeight * 255); // R
        textureData[index + 1] = Math.floor(blend.neighbor1Weight * 255); // G
        textureData[index + 2] = Math.floor(blend.neighbor2Weight * 255); // B
        textureData[index + 3] = Math.floor((blend.neighbor1Index / 5) * 255); // A (0-5 mapped to 0-255)
      }
    }

    // Create DataTexture
    const texture = new THREE.DataTexture(
      textureData,
      resolution,
      resolution,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
    );

    texture.needsUpdate = true;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
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

export default HexBlendingTextureRenderer;
