import * as THREE from "three";
import TerrainGrid from "../terrain/TerrainGrid";
import GameCamera from "../GameCamera";

class TerrainRenderer {
  private terrainGrid: TerrainGrid | null = null;

  constructor() {}

  init(scene: THREE.Scene) {
    // Create a 3x3 grid (numPlanes = 1)
    this.terrainGrid = new TerrainGrid(scene, 3);
  }

  update(camera: GameCamera | null) {
    if (!this.terrainGrid || !camera) {
      return;
    }

    this.terrainGrid.update(camera.getLookAtPosition());
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
