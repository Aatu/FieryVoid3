import { loadObject } from "../utils/objectLoader";
import * as THREE from "three";

import HexagonMath from "../../../../model/utils/HexagonMath";

class TerrainRenderer {
  constructor(scene) {
    this.scene = scene;
    this.terrain = null;
    this.terrainObjects = [];
  }

  init() {}

  update(terrain) {
    //TODO: This creates new objects every time gamedata updates.
    return;

    this.terrain = terrain;
    console.log("update terrain renderer", terrain);

    this.terrainObjects = this.terrain.getEntities().forEach(entity => ({
      entity,
      object: this.createObject(entity)
    }));
  }

  async createObject(entity) {
    console.log("hi");
    const object = await loadObject("/img/3d/sphere/scene.gltf");

    const material = object.children[0].material;

    material.emissive = new THREE.Color(1, 1, 1);

    object.position.set(0, 0, 0);
    const scale = HexagonMath.getHexWidth() * entity.diameter;
    console.log("scale", scale);
    object.scale.set(scale, scale, scale);
    this.scene.add(object);
  }

  render() {}
}

export default TerrainRenderer;
