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
 */

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

  const result = torpedoMovementService.predictTorpedoHitPositionAndTurn(
    flight,
    target
  );

  console.log(result);

  test.is(Math.floor(result.impactTurn), 2);

  test.deepEqual(
    coordinateConverter.fromGameToHex(result.impactPosition),
    new Offset(130, 0)
  );
});

test("Torpedo impact is predicted properly", test => {
  const torpedoMovementService = new TorpedoMovementService();
  /*
  test.deepEqual(
    torpedoMovementService.torpedoMath(
      new Vector(0, 0),
      new Vector(-2, -4),
      new Vector(10, 10),
      new Vector(-2, 2),
      2.1
    ),
    {
      accelerationAngle: 1.3843228976223712,
      impactTurn: 7.167319821001909,
      impactVelocity: 8.565338154491847,
      accelerationVector: new Vector(0.1853946202770851, 0.982664151565689)
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
      accelerationAngle: 6.63170520061493,
      impactTurn: 3.1832395775454327,
      impactVelocity: 9.84450993877127,
      accelerationVector: new Vector(0.9398792090089263, 0.3415070606484659)
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
      accelerationAngle: 1.483176005605391,
      impactTurn: 4.192483970472102,
      impactVelocity: 4.818176441871593,
      accelerationVector: new Vector(0.08750824933468117, 0.9961637949144605)
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
      accelerationVector: new Vector(0.9513937748501475, -0.3079770854729078),
      accelerationAngle: 5.970119272801,
      impactTurn: 0.6024862787564024,
      impactVelocity: 2511.767037426202
    }
  );
*/
  test.deepEqual(
    torpedoMovementService.torpedoMath(
      new Vector(0, 0),
      new Vector(0, 0),
      new Vector(1082.5317547305483, 0),
      new Vector(866.0254037844386, 0),
      1039.2304845413264
    ),
    {
      accelerationVector: new Vector(1, 0),
      accelerationAngle: 0,
      impactTurn: 2.4999999999999996,
      impactVelocity: 866.0254037844384
    }
  );
});

test("Test torpedo movement standardize function", test => {
  const torpedoMovementService = new TorpedoMovementService();

  const result = torpedoMovementService.standardize(
    new Vector(-1527.8075543423627, 52.86648115797515),
    new Vector(691.3825428552611, -3.3835188420248485),
    new Vector(-562.9165124598852, 0),
    new Vector(-649.519052838329, 0)
  );

  test.deepEqual(result, {
    newTargetPosition: new Vector(966.3382366102873, 0),
    newShooterVelocity: new Vector(1339.0785580469899, 69.97966070341435),
    φ: -0.05473537736695087
  });
});

test("Test torpedo math", test => {
  const torpedoMovementService = new TorpedoMovementService();

  const result = torpedoMovementService.torpedoMath(
    new Vector(-1527.8075543423627, 52.86648115797515),
    new Vector(691.3825428552611, -3.3835188420248485),
    new Vector(-562.9165124598852, 0),
    new Vector(-649.519052838329, 0),
    909.3266739736607
  );

  test.deepEqual(result, {
    accelerationVector: new Vector(0.9513937748501475, -0.3079770854729078),
    accelerationAngle: 5.970119272801,
    impactTurn: 0.6024862787564024,
    impactVelocity: 2511.767037426202
  });
});

test("Torpedo math notices and reports NaN", test => {
  const torpedoMovementService = new TorpedoMovementService();

  const error = test.throws(() =>
    torpedoMovementService.torpedoMath(
      new Vector(-1527.8075543423627, 52.86648115797515),
      new Vector(691.3825428552611, -3.3835188420248485),
      new Vector(-562.9165124598852, 0),
      new Vector(-649.519052838329, 0),
      0
    )
  );
  test.is(
    error.message,
    "Torpedo math encountered NaN with values '(x:-1527.8075543423627, y:52.86648115797515, z:0), '(x:691.3825428552611, y:-3.3835188420248485, z:0), '(x:-562.9165124598852, y:0, z:0), '(x:-649.519052838329, y:0, z:0),'0'"
  );
});
