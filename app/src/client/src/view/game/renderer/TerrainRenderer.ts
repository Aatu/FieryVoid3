import * as THREE from "three";
import TerrainGrid from "../terrain/TerrainGrid";

class TerrainRenderer {
  private terrainGrid: TerrainGrid | null = null;

  constructor() {}

  init(scene: THREE.Scene) {
    // Create a 3x3 grid (numPlanes = 1)
    this.terrainGrid = new TerrainGrid(scene, 2);
  }

  update(cameraPosition: { x: number; y: number }) {
    if (!this.terrainGrid) {
      return;
    }

    this.terrainGrid.update(cameraPosition);
  }

  render() {
    // Animation or updates can be added here later
  }

  dispose() {
    if (this.terrainGrid) {
      this.terrainGrid.dispose();
      this.terrainGrid = null;
    }
  }
}

export default TerrainRenderer;
