import { loadObject } from "../utils/objectLoader";
import * as THREE from "three";

class TerrainRenderer {
  constructor(scene) {
    this.scene = scene;
    this.terrain = null;
    this.terrainObjects = [];
  }

  init() {}

  update(terrain) {
    this.terrain = terrain;
    console.log("update terrain renderer", terrain);

    if (this.terrainObjects.length === 0) {
      this.createSun();
    }
  }

  async createSun() {
    const object = await loadObject("/img/3d/sphere/scene.gltf");

    const material = object.children[0].material;

    material.emissive = new THREE.Color(1, 1, 1);

    object.position.set(0, 0, 0);
    object.scale.set(2, 2, 2);
    this.scene.add(object);
  }

  render() {}
}

export default TerrainRenderer;
