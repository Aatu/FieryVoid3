import test from "ava";
import TorpedoHandler from "../../server/handler/TorpedoHandler.mjs";
import TorpedoFlight from "../../model/unit/TorpedoFlight.mjs";
import Vector from "../../model/utils/Vector.mjs";

test("Torpedos get moved properly", test => {
  const torpedo = new TorpedoFlight({ deltaVelocityPerTurn: 3 }, 1, 2, 3, 1);
  torpedo.setPosition(new Vector(100, 0));
  torpedo.setVelocity(new Vector(0, -100));

  const flights = [torpedo];
  const targetPosition = new Vector(500, 400);

  const target = {
    getPosition: () => targetPosition
  };

  const gameData = {
    torpedos: {
      getTorpedoFlights: () => flights
    },
    ships: {
      getShipById: () => target
    }
  };

  const handler = new TorpedoHandler();
  handler.advance(gameData);

  test.deepEqual(torpedo.position.round(), new Vector(100, 0));
});
