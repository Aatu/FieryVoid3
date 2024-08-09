import GameTerrainEntity from "../game/GameTerrainEntity";
import THREE from "three";

class Sun extends GameTerrainEntity {
  constructor(id) {
    super({
      id,
      position: new THREE.Vector3(0, 0, 0),
      target: new THREE.Vector3(0, 0, 0),
      mass: 1000000000,
      diameter: 7,
    });
  }
}

export default Sun;
