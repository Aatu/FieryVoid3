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
