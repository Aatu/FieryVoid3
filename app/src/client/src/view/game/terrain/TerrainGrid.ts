import * as THREE from "three";
import { HEX_SIZE } from "@fieryvoid3/model/src/config/gameConfig";
import { createTerrainShaderMaterial } from "./terrainShader";
import { HexGeometry } from "./HexGeometry";
import HexGridLookupTextureRenderer from "./HexGridLookupTextureRenderer";
import { getHexGeometry, clearGeometryCache } from "./HexGeometryFactory";

const DEBUG = false;
const DEBUG_HEX_COORDS = false; // Set to true to visualize hex coordinate lookup

interface TerrainPlane {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial | THREE.MeshStandardMaterial;
  gridX: number;
  gridY: number;
  textureLookup: THREE.DataTexture | null;
}

class TerrainGrid {
  private scene: THREE.Scene;
  private planeWidth: number;
  private planeHeight: number;
  private spacingWidth: number;
  private spacingHeight: number;
  private borderWidth: number;
  private borderHeight: number;
  private numPlanes: number;
  private terrainPlanes: TerrainPlane[] = [];
  private geometryCache: Map<string, HexGeometry> = new Map();
  private textureCache: Map<string, THREE.DataTexture> = new Map();
  private workers: Worker[] = [];
  private workerIndex: number = 0;
  private pendingGeometry: Map<
    string,
    {
      geometry: HexGeometry;
      callbacks: ((
        geometry: HexGeometry,
        texture: THREE.DataTexture,
      ) => void)[];
    }
  > = new Map();
  private readonly WORKER_COUNT = 4;
  private readonly GRID_Z = 0;
  private readonly GRID_SIZE = 32;
  private hexLookupRenderer: HexGridLookupTextureRenderer;
  private hexCoordLookupTexture: THREE.DataTexture;

  constructor(scene: THREE.Scene, numPlanes: number) {
    this.scene = scene;
    this.numPlanes = numPlanes;

    const coreGridWidth = this.GRID_SIZE;
    const coreGridHeight = this.GRID_SIZE;
    const borderSize = 1;

    const renderGridWidth = coreGridWidth + borderSize;
    const renderGridHeight = coreGridHeight + borderSize;

    this.planeWidth = renderGridWidth * Math.sqrt(3) * HEX_SIZE;
    this.planeHeight = renderGridHeight * 1.5 * HEX_SIZE;

    this.spacingWidth = coreGridWidth * Math.sqrt(3) * HEX_SIZE;
    this.spacingHeight = coreGridHeight * 1.5 * HEX_SIZE;

    this.borderWidth = borderSize * Math.sqrt(3) * HEX_SIZE;
    this.borderHeight = borderSize * 1.5 * HEX_SIZE;

    // Generate hex coordinate lookup texture
    this.hexLookupRenderer = new HexGridLookupTextureRenderer();
    this.hexCoordLookupTexture = this.hexLookupRenderer.generateTexture(
      1024,
      this.GRID_SIZE,
    );

    this.initWorkers();
    this.createGrid();
  }

  private initWorkers() {
    for (let i = 0; i < this.WORKER_COUNT; i++) {
      const worker = new Worker(
        new URL("./terrainWorker.ts", import.meta.url),
        {
          type: "module",
        },
      );

      worker.onmessage = (e: MessageEvent) => {
        const { gridX, gridY, positions, textureData, textureSize } = e.data;
        const cacheKey = `${gridX},${gridY}`;

        const pending = this.pendingGeometry.get(cacheKey);
        if (!pending) {
          return;
        }

        const { geometry, callbacks } = pending;

        const positionAttr = geometry.attributes.position;
        const currentArray = positionAttr.array as Float32Array;

        for (let i = 0; i < positions.length / 3; i++) {
          currentArray[i * 3 + 2] = positions[i * 3 + 2];
        }

        positionAttr.needsUpdate = true;
        geometry.computeVertexNormals();

        this.geometryCache.set(cacheKey, geometry);

        // Create texture lookup from worker data
        const texture = new THREE.DataTexture(
          textureData,
          textureSize,
          textureSize,
          THREE.RedFormat,
          THREE.UnsignedByteType,
        );
        texture.needsUpdate = true;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        this.textureCache.set(cacheKey, texture);

        callbacks.forEach((callback) => callback(geometry, texture));
        this.pendingGeometry.delete(cacheKey);
      };

      this.workers.push(worker);
    }
  }

  private createGrid() {
    // Create grid from -numPlanes to +numPlanes
    // numPlanes = 1 creates 3x3 grid (-1, 0, 1)
    // numPlanes = 2 creates 5x5 grid (-2, -1, 0, 1, 2)
    for (let gridX = -this.numPlanes; gridX <= this.numPlanes; gridX++) {
      for (let gridY = -this.numPlanes; gridY <= this.numPlanes; gridY++) {
        this.createPlaneAt(gridX, gridY);
      }
    }
  }

  private createPlaneAt(gridX: number, gridY: number) {
    const cacheKey = `${gridX},${gridY}`;
    const cachedGeometry = this.geometryCache.get(cacheKey);

    // Calculate world position for this grid tile
    const positionX = gridX * this.spacingWidth;
    const positionY = gridY * this.spacingHeight;

    const geometry = cachedGeometry || getHexGeometry(this.GRID_SIZE);

    const material = createTerrainShaderMaterial(
      this.planeWidth,
      this.planeHeight,
      this.borderWidth,
      this.borderHeight,
      gridX,
      gridY,
      DEBUG,
    );

    // Set hex coordinate lookup texture
    (material as THREE.ShaderMaterial).uniforms.hexCoordLookup.value =
      this.hexCoordLookupTexture;
    (material as THREE.ShaderMaterial).uniforms.debugHexCoords.value =
      DEBUG_HEX_COORDS;

    const mesh = new THREE.Mesh(geometry, material);

    // Position mesh at the calculated world position
    mesh.position.set(positionX, positionY, this.GRID_Z);

    this.scene.add(mesh);

    const plane: TerrainPlane = {
      mesh,
      material,
      gridX,
      gridY,
      textureLookup: null,
    };

    this.terrainPlanes.push(plane);

    if (!cachedGeometry) {
      this.requestGeometryDeformation(
        gridX,
        gridY,
        geometry,
        positionX,
        positionY,
        (_geometry: HexGeometry, texture: THREE.DataTexture) => {
          // Geometry is already updated in place by the worker
          // Just need to update the texture
          if (plane.textureLookup) {
            plane.textureLookup.dispose();
          }
          plane.textureLookup = texture;
          (material as THREE.ShaderMaterial).uniforms.textureLookup.value =
            texture;
        },
      );
    }
  }

  private requestGeometryDeformation(
    gridX: number,
    gridY: number,
    geometry: HexGeometry,
    originX: number,
    originY: number,
    callback: (geometry: HexGeometry, texture: THREE.DataTexture) => void,
  ) {
    const cacheKey = `${gridX},${gridY}`;

    if (this.geometryCache.has(cacheKey)) {
      const cachedGeometry = this.geometryCache.get(cacheKey)!;
      const cachedTexture = this.textureCache.get(cacheKey)!;
      callback(cachedGeometry, cachedTexture);
      return;
    }

    if (!this.pendingGeometry.has(cacheKey)) {
      this.pendingGeometry.set(cacheKey, { geometry, callbacks: [] });

      const worker = this.workers[this.workerIndex];
      this.workerIndex = (this.workerIndex + 1) % this.WORKER_COUNT;

      const positions = new Float32Array(geometry.attributes.position.array);

      worker.postMessage(
        {
          gridX,
          gridY,
          vertexCount: positions.length / 3,
          positions,
          originX,
          originY,
          gridSize: this.GRID_SIZE,
        },
        [positions.buffer],
      );
    }

    this.pendingGeometry.get(cacheKey)!.callbacks.push(callback);
  }

  update(cameraPosition: { x: number; y: number }) {
    return;

    this.terrainPlanes.forEach((plane) => {
      const distanceX = cameraPosition.x - plane.mesh.position.x;
      const distanceY = cameraPosition.y - plane.mesh.position.y;

      const threshold = this.numPlanes + 0.5;
      const shouldRepositionX =
        Math.abs(distanceX) > this.spacingWidth * threshold;
      const shouldRepositionY =
        Math.abs(distanceY) > this.spacingHeight * threshold;

      if (shouldRepositionX || shouldRepositionY) {
        // Determine new grid position
        // Move by the full grid size (2 * numPlanes + 1)
        const gridSize = 2 * this.numPlanes + 1;

        if (shouldRepositionX) {
          if (distanceX > 0) {
            // Camera is to the right, move plane to the right
            plane.gridX += gridSize;
          } else {
            // Camera is to the left, move plane to the left
            plane.gridX -= gridSize;
          }
        }

        if (shouldRepositionY) {
          if (distanceY > 0) {
            // Camera is above, move plane up
            plane.gridY += gridSize;
          } else {
            // Camera is below, move plane down
            plane.gridY -= gridSize;
          }
        }

        const cacheKey = `${plane.gridX},${plane.gridY}`;
        const cachedGeometry = this.geometryCache.get(cacheKey);
        const cachedTexture = this.textureCache.get(cacheKey);

        // Calculate world position for the new grid tile
        const positionX = plane.gridX * this.spacingWidth;
        const positionY = plane.gridY * this.spacingHeight;

        // Update mesh position immediately
        plane.mesh.position.x = positionX;
        plane.mesh.position.y = positionY;

        if (cachedGeometry && cachedTexture) {
          plane.mesh.geometry.dispose();
          plane.mesh.geometry = cachedGeometry;

          // Update texture
          if (plane.textureLookup) {
            plane.textureLookup.dispose();
          }
          plane.textureLookup = cachedTexture;
          (
            plane.material as THREE.ShaderMaterial
          ).uniforms.textureLookup.value = cachedTexture;
        } else {
          // Create new geometry for this position
          const newGeometry = getHexGeometry(this.GRID_SIZE);
          plane.mesh.geometry.dispose();
          plane.mesh.geometry = newGeometry;

          this.requestGeometryDeformation(
            plane.gridX,
            plane.gridY,
            newGeometry,
            positionX,
            positionY,
            (_geometry: HexGeometry, texture: THREE.DataTexture) => {
              // Geometry is already updated in place by the worker
              // Just need to update the texture
              if (plane.textureLookup) {
                plane.textureLookup.dispose();
              }
              plane.textureLookup = texture;
              (
                plane.material as THREE.ShaderMaterial
              ).uniforms.textureLookup.value = texture;
            },
          );
        }
      }
    });
  }

  dispose() {
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
    this.geometryCache.forEach((geometry) => geometry.dispose());
    this.geometryCache.clear();
    this.textureCache.forEach((texture) => texture.dispose());
    this.textureCache.clear();
    this.hexLookupRenderer.dispose();
    clearGeometryCache();
  }
}

export default TerrainGrid;
