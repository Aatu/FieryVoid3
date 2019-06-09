import test from "ava";
import Vector from "../../model/utils/Vector";
import GameTerrain from "../../model/game/GameTerrain";
import Sun from "../../model/terrain/Sun";

test("Get gravity vector", test => {
  const gameTerrain = new GameTerrain();
  gameTerrain.addEntity(new Sun("sunId"));

  const start = new Vector(0, 1000, 0);
  const velocity = new Vector(200, 0, 0);

  const {
    position: newPosition,
    velocity: newVelocity
  } = gameTerrain.getGravityVectorForTurn(start, velocity);

  test.deepEqual(newPosition, new Vector(10, 10, 0));
  test.deepEqual(newVelocity, new Vector(10, 10, 0));
});

test("Sun gravity", test => {
  const sun = new Sun();

  sun.gravity = 100;

  const gravityVector = sun.getGravityVector(new Vector(0, 1, 0));
  test.deepEqual(gravityVector, new Vector(0, -100, 0));
});
