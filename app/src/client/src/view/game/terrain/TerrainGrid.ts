import * as THREE from "three";
import { HEX_SIZE } from "@fieryvoid3/model/src/config/gameConfig";
import { createTerrainShaderMaterial } from "./terrainShader";

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
  private geometryCache: Map<string, THREE.PlaneGeometry> = new Map();
  private workers: Worker[] = [];
  private workerIndex: number = 0;
  private pendingGeometry: Map<
    string,
    ((geometry: THREE.PlaneGeometry) => void)[]
  > = new Map();
  private readonly WORKER_COUNT = 4;
  private readonly SEGMENTS = 100;
  private readonly GRID_Z = -10;
  private readonly GRID_SIZE = 64;

  constructor(scene: THREE.Scene, numPlanes: number) {
    this.scene = scene;
    this.numPlanes = numPlanes;

    const coreGridWidth = this.GRID_SIZE;
    const coreGridHeight = this.GRID_SIZE;
    const borderSize = 1;

    const renderGridWidth = coreGridWidth + 2 * borderSize;
    const renderGridHeight = coreGridHeight + 2 * borderSize;

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

        const geometry = new THREE.PlaneGeometry(
          this.planeWidth,
          this.planeHeight,
          this.SEGMENTS,
          this.SEGMENTS,
        );

        const positionAttr = geometry.attributes.position;
        const currentArray = positionAttr.array as Float32Array;

        for (let i = 0; i < positions.length / 3; i++) {
          currentArray[i * 3 + 2] = positions[i * 3 + 2];
        }

        positionAttr.needsUpdate = true;
        geometry.computeVertexNormals();

        this.geometryCache.set(cacheKey, geometry);

        const callbacks = this.pendingGeometry.get(cacheKey);
        if (callbacks) {
          callbacks.forEach((callback) => callback(geometry));
          this.pendingGeometry.delete(cacheKey);
        }
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

    const geometry =
      cachedGeometry ||
      new THREE.PlaneGeometry(
        this.planeWidth,
        this.planeHeight,
        this.SEGMENTS,
        this.SEGMENTS,
      );

    const material = DEBUG
      ? new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(
            (gridX +
              this.numPlanes +
              (gridY + this.numPlanes) * (2 * this.numPlanes + 1)) /
              (2 * this.numPlanes + 1) ** 2,
            0.3,
            0.5,
          ),
          wireframe: true,
        })
      : createTerrainShaderMaterial(
          this.planeWidth,
          this.planeHeight,
          this.borderWidth,
          this.borderHeight,
        );

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      gridX * this.spacingWidth,
      gridY * this.spacingHeight,
      this.GRID_Z,
    );

    this.scene.add(mesh);

    this.terrainPlanes.push({
      mesh,
      material,
      gridX,
      gridY,
    });

    if (!cachedGeometry) {
      this.requestGeometryDeformation(gridX, gridY, (deformedGeometry) => {
        mesh.geometry.dispose();
        mesh.geometry = deformedGeometry;
      });
    }
  }

  private requestGeometryDeformation(
    gridX: number,
    gridY: number,
    callback: (geometry: THREE.PlaneGeometry) => void,
  ) {
    const cacheKey = `${gridX},${gridY}`;

    if (this.geometryCache.has(cacheKey)) {
      callback(this.geometryCache.get(cacheKey)!);
      return;
    }

    if (!this.pendingGeometry.has(cacheKey)) {
      this.pendingGeometry.set(cacheKey, []);

      const worker = this.workers[this.workerIndex];
      this.workerIndex = (this.workerIndex + 1) % this.WORKER_COUNT;

      const tempGeometry = new THREE.PlaneGeometry(
        this.planeWidth,
        this.planeHeight,
        this.SEGMENTS,
        this.SEGMENTS,
      );
      const positions = new Float32Array(
        tempGeometry.attributes.position.array,
      );
      tempGeometry.dispose();

      worker.postMessage(
        {
          gridX,
          gridY,
          spacingWidth: this.spacingWidth,
          spacingHeight: this.spacingHeight,
          vertexCount: positions.length / 3,
          positions,
        },
        [positions.buffer],
      );
    }

    this.pendingGeometry.get(cacheKey)!.push(callback);
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

        plane.mesh.position.x = plane.gridX * this.spacingWidth;
        plane.mesh.position.y = plane.gridY * this.spacingHeight;

        const cacheKey = `${plane.gridX},${plane.gridY}`;
        const cachedGeometry = this.geometryCache.get(cacheKey);

        if (cachedGeometry) {
          plane.mesh.geometry.dispose();
          plane.mesh.geometry = cachedGeometry;
        } else {
          this.requestGeometryDeformation(
            plane.gridX,
            plane.gridY,
            (deformedGeometry) => {
              plane.mesh.geometry.dispose();
              plane.mesh.geometry = deformedGeometry;
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
