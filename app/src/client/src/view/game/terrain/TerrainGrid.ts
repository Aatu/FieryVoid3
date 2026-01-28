import * as THREE from "three";
import { HEX_SIZE } from "@fieryvoid3/model/src/config/gameConfig";
import { createTerrainShaderMaterial } from "./terrainShader";
import { HexGeometry } from "./HexGeometry";

const DEBUG = false;

interface TerrainPlane {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial | THREE.MeshStandardMaterial;
  gridX: number;
  gridY: number;
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
  private workers: Worker[] = [];
  private workerIndex: number = 0;
  private pendingGeometry: Map<
    string,
    { geometry: HexGeometry; callbacks: ((geometry: HexGeometry) => void)[] }
  > = new Map();
  private readonly WORKER_COUNT = 4;
  private readonly GRID_Z = 0;
  private readonly GRID_SIZE = 32;

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
        const { gridX, gridY, positions } = e.data;
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

        callbacks.forEach((callback) => callback(geometry));
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

    const geometry =
      cachedGeometry || new HexGeometry(this.GRID_SIZE, positionX, positionY);

    const material = createTerrainShaderMaterial(
      this.planeWidth,
      this.planeHeight,
      this.borderWidth,
      this.borderHeight,
      gridX,
      gridY,
      DEBUG,
    );

    const mesh = new THREE.Mesh(geometry, material);

    // Position mesh at the geometry's origin
    mesh.position.set(geometry.originX, geometry.originY, this.GRID_Z);

    this.scene.add(mesh);

    this.terrainPlanes.push({
      mesh,
      material,
      gridX,
      gridY,
    });

    if (!cachedGeometry) {
      this.requestGeometryDeformation(
        gridX,
        gridY,
        geometry,
        (deformedGeometry: HexGeometry) => {
          // Geometry is already updated in place, just need to update position if changed
          mesh.position.x = deformedGeometry.originX;
          mesh.position.y = deformedGeometry.originY;
        },
      );
    }
  }

  private requestGeometryDeformation(
    gridX: number,
    gridY: number,
    geometry: HexGeometry,
    callback: (geometry: HexGeometry) => void,
  ) {
    const cacheKey = `${gridX},${gridY}`;

    if (this.geometryCache.has(cacheKey)) {
      callback(this.geometryCache.get(cacheKey)!);
      return;
    }

    if (!this.pendingGeometry.has(cacheKey)) {
      this.pendingGeometry.set(cacheKey, { geometry, callbacks: [] });

      const worker = this.workers[this.workerIndex];
      this.workerIndex = (this.workerIndex + 1) % this.WORKER_COUNT;

      const positions = new Float32Array(geometry.attributes.position.array);
      const originX = geometry.originX;
      const originY = geometry.originY;

      worker.postMessage(
        {
          gridX,
          gridY,
          vertexCount: positions.length / 3,
          positions,
          originX,
          originY,
        },
        [positions.buffer],
      );
    }

    this.pendingGeometry.get(cacheKey)!.callbacks.push(callback);
  }

  update(cameraPosition: { x: number; y: number }) {
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

        if (cachedGeometry) {
          plane.mesh.geometry.dispose();
          plane.mesh.geometry = cachedGeometry;
          plane.mesh.position.x = cachedGeometry.originX;
          plane.mesh.position.y = cachedGeometry.originY;
        } else {
          // Calculate world position for the new grid tile
          const positionX = plane.gridX * this.spacingWidth;
          const positionY = plane.gridY * this.spacingHeight;

          // Create new geometry for this position
          const newGeometry = new HexGeometry(
            this.GRID_SIZE,
            positionX,
            positionY,
          );

          this.requestGeometryDeformation(
            plane.gridX,
            plane.gridY,
            newGeometry,
            (deformedGeometry: HexGeometry) => {
              plane.mesh.geometry.dispose();
              plane.mesh.geometry = deformedGeometry;
              plane.mesh.position.x = deformedGeometry.originX;
              plane.mesh.position.y = deformedGeometry.originY;
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
  }
}

export default TerrainGrid;
