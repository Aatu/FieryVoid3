import test from "ava";
import TorpedoMovementService from "../../model/movement/TorpedoMovementService.mjs";
import TorpedoFlight from "../../model/unit/TorpedoFlight.mjs";
import Torpedo158 from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo158.mjs";
import Ship from "../../model/unit/Ship.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import Offset from "../../model/hexagon/Offset.mjs";
import movementTypes from "../../model/movement/MovementTypes.mjs";
import coordinateConverter from "../../model/utils/CoordinateConverter.mjs";
import Vector from "../../model/utils/Vector.mjs";
import Torpedo158MSV from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo158MSV.mjs";

/*
test("Torpedo moves properly", test => {
  const torpedoMovementService = new TorpedoMovementService();
  const torpedo = new Torpedo158({ deltaVelocityPerTurn: 10, turnsToLive: 5 });
  const flight = new TorpedoFlight(torpedo)
    .setPosition(coordinateConverter.fromHexToGame(new Offset(0, 0)))
    .setVelocity(new Vector(0, 0));
  const target = new Ship({ id: 1 });

  target.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.DEPLOY,
      new Offset(50, 0),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  torpedoMovementService.moveTorpedo(flight, target.getPosition());

  test.deepEqual(
    coordinateConverter.fromGameToHex(flight.position),
    new Offset(10, 0)
  );

  test.deepEqual(
    coordinateConverter.fromGameToHex(flight.velocity),
    new Offset(10, 0)
  );

  torpedoMovementService.moveTorpedo(flight, target.getPosition());

  test.deepEqual(
    coordinateConverter.fromGameToHex(flight.position),
    new Offset(30, 0)
  );

  test.deepEqual(
    coordinateConverter.fromGameToHex(flight.velocity),
    new Offset(20, 0)
  );
});

test("Torpedo moves on both axis properly", test => {
  const torpedoMovementService = new TorpedoMovementService();
  const torpedo = new Torpedo158({ deltaVelocityPerTurn: 10, turnsToLive: 5 });
  const flight = new TorpedoFlight(torpedo)
    .setPosition(coordinateConverter.fromHexToGame(new Offset(0, 0)))
    .setVelocity(new Vector(0, 0));
  const target = new Ship({ id: 1 });

  target.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.DEPLOY,
      new Offset(50, 50),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  torpedoMovementService.moveTorpedo(flight, target.getPosition());

  test.deepEqual(
    coordinateConverter.fromGameToHex(flight.position),
    new Offset(8, 7)
  );

  test.deepEqual(
    coordinateConverter.fromGameToHex(flight.velocity),
    new Offset(8, 7)
  );

  torpedoMovementService.moveTorpedo(flight, target.getPosition());

  test.deepEqual(
    coordinateConverter.fromGameToHex(flight.position),
    new Offset(23, 23)
  );

  test.deepEqual(
    coordinateConverter.fromGameToHex(flight.velocity),
    new Offset(16, 15)
  );
});

test("Torpedo strikes target properly", test => {
  const torpedoMovementService = new TorpedoMovementService();
  const torpedo = new Torpedo158({ deltaVelocityPerTurn: 10, turnsToLive: 5 });
  const flight = new TorpedoFlight(torpedo)
    .setPosition(coordinateConverter.fromHexToGame(new Offset(0, 0)))
    .setVelocity(new Vector(0, 0));
  const target = new Ship({ id: 1 });

  target.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.DEPLOY,
      new Offset(50, 0),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  test.false(
    torpedoMovementService.reachesTargetThisTurn(flight, target.getPosition())
  );
  flight.setVelocity(coordinateConverter.fromHexToGame(new Offset(50, 0)));
  test.true(
    torpedoMovementService.reachesTargetThisTurn(flight, target.getPosition())
  );
  flight.setVelocity(coordinateConverter.fromHexToGame(new Offset(5000, 0)));
  test.true(
    torpedoMovementService.reachesTargetThisTurn(flight, target.getPosition())
  );
});

test("Predict torpedo hit turn and position", test => {
  const torpedoMovementService = new TorpedoMovementService();
  const torpedo = new Torpedo158MSV();
  const flight = new TorpedoFlight(torpedo)
    .setPosition(coordinateConverter.fromHexToGame(new Offset(0, 0)))
    .setVelocity(new Vector(0, 0));
  const target = new Ship({ id: 1 });

  target.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.DEPLOY,
      new Offset(50, 0),
      new Offset(40, 0),
      0,
      false,
      1
    )
  );

  test.is(
    torpedoMovementService.predictTorpedoHitPositionAndTurn(flight, target)
      .impactTurn,
    2
  );

  test.deepEqual(
    coordinateConverter.fromGameToHex(
      torpedoMovementService.predictTorpedoHitPositionAndTurn(flight, target)
        .impactPosition
    ),
    new Offset(130, 0)
  );
});
*/

/*
test("Torpedo impact is predicted properly", test => {
  const torpedoMovementService = new TorpedoMovementService();

  test.deepEqual(
    torpedoMovementService.torpedoMath(
      new Vector(0, 0),
      new Vector(-2, -4),
      new Vector(10, 10),
      new Vector(-2, 2),
      2.1
    ),
    {
      accelerationAngle: 1.384322896202497,
      impactTurn: 7.167319835911543,
      impactVelocity: 9.222714809910437,
      accelerationVector: new Vector(0.18539462167234408, 0.9826641513024488)
    }
  );

  test.deepEqual(
    torpedoMovementService.torpedoMath(
      new Vector(0, 0),
      new Vector(-2, 4),
      new Vector(10, 10),
      new Vector(-2, 2),
      2.1
    ),
    {
      accelerationAngle: 0.34851989732158073,
      impactTurn: 3.183239604036988,
      impactVelocity: 7.603829523554417,
      accelerationVector: new Vector(0.9398792076817462, 0.34150706430105826)
    }
  );

  test.deepEqual(
    torpedoMovementService.torpedoMath(
      new Vector(0, 0),
      new Vector(0, 0),
      new Vector(10, 10),
      new Vector(-2, 2),
      2.1
    ),
    {
      accelerationAngle: 1.4197824327299757,
      impactTurn: 3.6792564499022196,
      impactVelocity: 8.191312662338385,
      accelerationVector: new Vector(0.18583994800731418, 1.2212458408542375)
    }
  );
  test.deepEqual(
    torpedoMovementService.torpedoMath(
      new Vector(-1527.8075543423627, 52.86648115797515),
      new Vector(691.3825428552611, -3.3835188420248485),
      new Vector(-562.9165124598852, 0),
      new Vector(-649.519052838329, 0),
      909.3266739736607
    ),
    {
      accelerationAngle: 1.4197824327299757,
      impactTurn: 3.6792564499022196,
      impactVelocity: 8.191312662338385,
      accelerationVector: new Vector(0.18583994800731418, 1.2212458408542375)
    }
  );
});

*/
