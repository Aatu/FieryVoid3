class TerrainRenderer {
  constructor() {}

  init() {}

  update() {
    //TODO: This creates new objects every time gamedata updates.
    return;

    /*
    this.terrain = terrain;

    this.terrainObjects = this.terrain.getEntities().forEach((entity) => ({
      entity,
      object: this.createObject(entity),
    }));

    */
  }

  /*
  async createObject(entity) {
    const object = await loadObject("/img/3d/sphere/scene.gltf");

    const material = object.children[0].material;

    material.emissive = new THREE.Color(1, 1, 1);

    object.position.set(0, 0, 0);
    const scale = HexagonMath.getHexWidth() * entity.diameter;
    object.scale.set(scale, scale, scale);
    this.scene.add(object);
  }
    */

  render() {}
}

export default TerrainRenderer;
