import * as THREE from "three";
import { HexGeometry } from "./HexGeometry";

// Cache for base geometries by size
const geometryCache = new Map<number, THREE.BufferGeometry>();

/**
 * Get a HexGeometry instance with the specified parameters.
 * Uses caching to build the mesh only once per size and clone for subsequent requests.
 *
 * @param size - Grid size (number of hexes)
 * @returns A HexGeometry instance
 */
export function getHexGeometry(size: number): HexGeometry {
  const cachedGeometry = geometryCache.get(size);

  if (cachedGeometry) {
    // Clone from cached geometry
    const geometry = new HexGeometry(size, cachedGeometry);
    return geometry;
  } else {
    // Build new geometry and cache it
    const geometry = new HexGeometry(size);

    // Cache a plain BufferGeometry copy
    const cacheGeometry = new THREE.BufferGeometry();
    cacheGeometry.copy(geometry);
    geometryCache.set(size, cacheGeometry);

    return geometry;
  }
}

/**
 * Clear the geometry cache and dispose of all cached geometries.
 * Call this when geometries are no longer needed to free memory.
 */
export function clearGeometryCache(): void {
  geometryCache.forEach((geometry) => geometry.dispose());
  geometryCache.clear();
}
