import test from "ava";
import THREE from "three";
import GameTerrain from "../../model/game/GameTerrain";
import Sun from "../../model/terrain/Sun";
import CoordinateConverter from "../../model/utils/CoordinateConverter";

const coordinateConverter = new CoordinateConverter();

test("Get gravity vector", test => {
  const gameTerrain = new GameTerrain();
  gameTerrain.addEntity(new Sun("sunId"));

  const start = new THREE.Vector3(0, 1000, 0);
  const end = new THREE.Vector3(200, 1000, 0);

  const gravity = gameTerrain.getGravityVector(start, end, coordinateConverter);
  test.deepEqual(gravity, new THREE.Vector3(10, 10, 0));
});
