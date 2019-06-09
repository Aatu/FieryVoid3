import GameTerrainEntity from "../game/GameTerrainEntity.mjs";
import THREE from "three";

class Sun extends GameTerrainEntity {
  constructor(id) {
    super({
      id,
      position: new THREE.Vector3(0, 0, 0),
      target: new THREE.Vector3(0, 0, 0),
      gravity: 1000000000
    });
  }
}

export default Sun;
