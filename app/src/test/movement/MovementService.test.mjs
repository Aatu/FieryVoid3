import test from "ava";
import Vector from "../../model/utils/Vector";
import MovementService from "../../model/movement/MovementService";
import movementTypes from "../../model/movement/movementTypes";
import MovementOrder from "../../model/movement/MovementOrder";
import hexagon from "../../model/hexagon";
import Ship from "../../model/unit/Ship.mjs";
import GameTerrain from "../../model/game/GameTerrain";
import coordinateConverter from "../../model/utils/CoordinateConverter";

import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import ManeuveringThruster from "../../model/unit/system/thruster/ManeuveringThruster.mjs";
import { OutputReduced6 } from "../../model/unit/system/criticals/index.mjs";
import ManeuveringThrusterLeft from "../../model/unit/system/thruster/ManeuveringThrusterLeft.mjs";
import ManeuveringThrusterRight from "../../model/unit/system/thruster/ManeuveringThrusterRight.mjs";

const startMove = new MovementOrder(
  -1,
  movementTypes.START,
  new hexagon.Offset(-32, 5),
  new hexagon.Offset(3, 2),
  0,
  false,
  999,
  0,
  null,
  1
);

const deployMove = new MovementOrder(
  -1,
  movementTypes.DEPLOY,
  new hexagon.Offset(0, 0),
  startMove.velocity,
  startMove.facing,
  startMove.rolled,
  999,
  0,
  null,
  2
);

const getMovementService = () =>
  new MovementService().update({ turn: 999 }, { relayEvent: () => null });

const constructShip = (id = 123) => {
  let ship = new Ship({
    id
  });

  ship.accelcost = 3;
  ship.rollcost = 3;
  ship.pivotcost = 3;
  ship.evasioncost = 3;

  ship.systems.addPrimarySystem([
    new Thruster({ id: 1, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 2, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 5, [1, 2]),
    new Thruster({ id: 9, hitpoints: 10, armor: 3 }, 5, [4, 5]),
    new Thruster({ id: 3, hitpoints: 10, armor: 3 }, 5, 3),
    new Thruster({ id: 4, hitpoints: 10, armor: 3 }, 5, 3),
    new ManeuveringThrusterLeft({ id: 10, hitpoints: 10, armor: 3 }, 9, 3),
    new ManeuveringThrusterRight({ id: 11, hitpoints: 10, armor: 3 }, 9, 3),
    new Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20)
  ]);

  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = id => {
  const ship = constructShip(id);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (test, moves1, moves2) => {
  test.deepEqual(
    moves1.map(move =>
      move
        .clone()
        .setRequiredThrust(null)
        .setIndex(0)
    ),
    moves2.map(move =>
      move
        .clone()
        .setRequiredThrust(null)
        .setIndex(0)
    )
  );
};

test("Ship can be deployed", test => {
  const movementService = getMovementService();
  const ship = constructShip();

  const pos = new hexagon.Offset(10, 40);

  movementService.deploy(ship, pos);
  test.deepEqual(ship.movement.getMovement(), [
    startMove,
    new MovementOrder(
      -1,
      movementTypes.DEPLOY,
      pos,
      startMove.velocity,
      startMove.facing,
      startMove.rolled,
      999,
      0,
      null,
      2
    )
  ]);

  const pos2 = new hexagon.Offset(2, 3);
  movementService.deploy(ship, pos2);
  test.deepEqual(ship.movement.getMovement(), [
    startMove,
    new MovementOrder(
      -1,
      movementTypes.DEPLOY,
      pos2,
      startMove.velocity,
      startMove.facing,
      startMove.rolled,
      999,
      0,
      null,
      2
    )
  ]);
});

test("Ship can thrust", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  test.true(movementService.canThrust(ship, 0));
  test.true(movementService.canThrust(ship, 1));
  test.true(movementService.canThrust(ship, 2));
  test.true(movementService.canThrust(ship, 3));
  test.true(movementService.canThrust(ship, 4));
  test.true(movementService.canThrust(ship, 5));
});

test("Ship can not thrust with destroyed thruster", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  ship.systems.getSystemById(9).addDamage(new DamageEntry(50));

  test.is(ship.movement.getThrusters().length, 7);
  test.is(ship.movement.getMovement().length, 2);

  test.true(movementService.canThrust(ship, 0));

  test.false(movementService.canThrust(ship, 1));
  test.false(movementService.canThrust(ship, 2));
  test.is(ship.movement.getThrusters().length, 7);
  test.is(ship.movement.getMovement().length, 2);
  test.true(movementService.canThrust(ship, 3));
  test.true(movementService.canThrust(ship, 4));
  test.true(movementService.canThrust(ship, 5));
});

test("Ship will thrust", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.thrust(ship, 3);
  movementService.thrust(ship, 3);
  compareMovements(test, ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      movementTypes.SPEED,
      deployMove.position,
      deployMove.getHexVelocity().add(new hexagon.Offset(-1, 0)),
      deployMove.facing,
      deployMove.rolled,
      999,
      3
    ),
    new MovementOrder(
      null,
      movementTypes.SPEED,
      deployMove.position,
      deployMove.getHexVelocity().add(new hexagon.Offset(-2, 0)),
      deployMove.facing,
      deployMove.rolled,
      999,
      3
    )
  ]);
});

test("Ship can not thrust unlimited amount", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.thrust(ship, 1);

  const error = test.throws(() => movementService.thrust(ship, 1));
  test.is(
    error.message,
    "Tried to commit move that was not legal. Check legality first!"
  );
});

test("Opposite thrusts will cancel each other out", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.thrust(ship, 3);
  movementService.thrust(ship, 0);
  compareMovements(test, ship.movement.getMovement(), [startMove, deployMove]);
});

test("Ship can pivot", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  test.true(movementService.canPivot(ship, -1));
  test.true(movementService.canPivot(ship, 1));
});

test("Ship will pivot", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.pivot(ship, 1);
  compareMovements(test, ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      movementTypes.PIVOT,
      deployMove.position,
      deployMove.velocity,
      1,
      deployMove.rolled,
      999,
      1
    )
  ]);
});

test("Two consecutive opposite pivots will cancel each other", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.pivot(ship, 1);
  movementService.pivot(ship, -1);
  compareMovements(test, ship.movement.getMovement(), [startMove, deployMove]);
});

test("Pivots with something in between will not cancel", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.pivot(ship, 1);
  movementService.thrust(ship, 2);
  movementService.pivot(ship, -1);
  compareMovements(test, ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      movementTypes.PIVOT,
      deployMove.position,
      deployMove.velocity,
      1,
      deployMove.rolled,
      999,
      1
    ),
    new MovementOrder(
      null,
      movementTypes.SPEED,
      deployMove.position,
      deployMove.getHexVelocity().add(new hexagon.Offset(0, -1)),
      1,
      deployMove.rolled,
      999,
      2
    ),
    new MovementOrder(
      null,
      movementTypes.PIVOT,
      deployMove.position,
      deployMove.getHexVelocity().add(new hexagon.Offset(0, -1)),
      0,
      deployMove.rolled,
      999,
      -1
    )
  ]);
});

test("Ship can roll", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  test.true(movementService.canRoll(ship));
});

test("Ship will roll", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.roll(ship);
  compareMovements(test, ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      movementTypes.ROLL,
      deployMove.position,
      deployMove.velocity,
      deployMove.facing,
      deployMove.rolled,
      999,
      true
    )
  ]);
});

test("Ship rolling twice does cancels each other out", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.roll(ship);
  movementService.roll(ship);
  compareMovements(test, ship.movement.getMovement(), [startMove, deployMove]);
});

test("Ship can evade", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  test.true(movementService.canEvade(ship, 1));
});

test("Ship will evade", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  compareMovements(test, ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      movementTypes.EVADE,
      deployMove.position,
      deployMove.velocity,
      deployMove.facing,
      deployMove.rolled,
      999,
      2
    )
  ]);
});

test("Evasion is limited by ship capabilities", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  test.false(movementService.canEvade(ship, 1));

  compareMovements(test, ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      movementTypes.EVADE,
      deployMove.position,
      deployMove.velocity,
      deployMove.facing,
      deployMove.rolled,
      999,
      6
    )
  ]);
});

test("Can not evade negative amount", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();
  test.false(movementService.canEvade(ship, -1));
});

test("Evasion cancels itself", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  movementService.evade(ship, -1);
  movementService.evade(ship, -1);

  compareMovements(test, ship.movement.getMovement(), [startMove, deployMove]);
});

test("Get an end move", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  const endMove = movementService.getNewEndMove(ship, new GameTerrain());

  compareMovements(
    test,
    [endMove.round()],
    [
      new MovementOrder(
        null,
        movementTypes.END,
        new hexagon.Offset(4, 1),
        new hexagon.Offset(4, 1),
        1,
        true,
        1000,
        0
      ).round()
    ]
  );
});

test("Boosted movements get deleted when engine deboosts", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();
  ship.systems.getSystemById(5).addDamage(new DamageEntry(50));
  const engine = ship.systems.getSystemById(6);
  engine.addCritical(new OutputReduced6());

  movementService.thrust(ship, 2);
  movementService.evade(ship, 1);
  test.falsy(movementService.canThrust(ship, 0));

  engine.callHandler("boost");
  engine.callHandler("boost");
  engine.callHandler("boost");

  test.true(movementService.canThrust(ship, 0));
  test.is(ship.movement.getMovement().length, 4);

  movementService.thrust(ship, 0);

  engine.callHandler("deBoost");
  test.is(ship.movement.getMovement().length, 4);
  test.falsy(movementService.canThrust(ship, 0));
});

test("Ship can not pivot, if relevant thruster is destroyed", test => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  ship.systems.getSystemById(11).addDamage(new DamageEntry(50));

  test.true(movementService.canPivot(ship, 1));
  test.false(movementService.canPivot(ship, -1));

  ship.systems.getSystemById(10).addDamage(new DamageEntry(50));
  test.false(movementService.canPivot(ship, 1));
});
