import test from "ava";
import ThrustBill from "../../model/movement/ThrustBill";
import MovementOrder from "../../model/movement/MovementOrder";
import movementTypes from "../../model/movement/movementTypes";
import hexagon from "../../model/hexagon";
import Thruster from "../../model/unit/system/thruster/Thruster";
import ManeuveringThruster from "../../model/unit/system/thruster/ManeuveringThruster";
import Ship from "../../model/unit/Ship";
import ThrustChannelHeatIncreased from "../../model/unit/system/criticals/ThrustChannelHeatIncreased";
import OutputReduced from "../../model/unit/system/criticals/OutputReduced";
import ManeuveringThrusterLeft from "../../model/unit/system/thruster/ManeuveringThrusterLeft";
import ManeuveringThrusterRight from "../../model/unit/system/thruster/ManeuveringThrusterRight";

let id = 0;

const getManouveringThruster = (output = 3, evasion = 0, criticals = []) => {
  id++;

  const thruster = new ManeuveringThruster(
    { id, hitpoints: 10, armor: 3 },
    output,
    evasion
  );
  criticals.forEach((crit) => thruster.addCritical(new crit()));
  return thruster;
};

const getThruster = (direction = 0, output = 3, criticals = []) => {
  id++;

  const thruster = new Thruster(
    { id, hitpoints: 10, armor: 3 },
    output,
    direction
  );
  criticals.forEach((crit) => thruster.addCritical(new crit()));
  return thruster;
};

let ship = new Ship();
ship.movement.isRolled = () => false;

ship.accelcost = 3;

ship.systems.addPrimarySystem([
  getThruster(0, 3),
  getThruster([1, 2], 3),
  getThruster(3, 3),
  getThruster([4, 5], 3),
]);
/*
systems: [
  getThruster(0, 3),
  getThruster([1, 2], 3),
  getThruster(3, 3),
  getThruster([4, 5], 3)
]
*/

const getMovementOrder = (type = "speed", facing = 0, value = 0) =>
  new MovementOrder(
    null,
    type,
    new hexagon.Offset(0, 0),
    new hexagon.Offset(0, 0),
    facing,
    0,
    false,
    value,
    null,
    null
  );

test("simple speed move", (test) => {
  const moves = [getMovementOrder("speed", 0, 0)];
  const bill = new ThrustBill(ship, moves);
  bill.fuel = 999;
  test.deepEqual(bill.directionsRequired, {
    0: 0,
    3: 3,
    1: 0,
    2: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  });
});

test("multiple speed moves", (test) => {
  const moves = [
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 3),
    getMovementOrder("speed", 0, 1),
    getMovementOrder("speed", 0, 2),
    getMovementOrder("speed", 0, 4),
    getMovementOrder("speed", 0, 4),
    getMovementOrder("speed", 0, 5),
  ];
  const bill = new ThrustBill(ship, moves);
  test.deepEqual(bill.directionsRequired, {
    0: 3,
    3: 3,
    1: 6,
    2: 3,
    4: 3,
    5: 3,
    6: 0,
    7: 0,
    8: 0,
  });
});

test("it uses thrusters properly", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;

  ship.systems.addPrimarySystem([getThruster(0, 3), getThruster(0, 3)]);

  const bill = new ThrustBill(ship, []);
  bill.fuel = 999;
  bill.useThrusters(0, 5);
  test.deepEqual(bill.thrusters[0].channeled, 2);
  test.deepEqual(bill.thrusters[1].channeled, 3);
});

test("it uses thrusters properly, with one thruster already overheating", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;

  const thruster = getThruster(0, 5);
  thruster.heat.overheat = 2;
  ship.systems.addPrimarySystem([getThruster(0, 5), thruster]);

  const bill = new ThrustBill(ship, []);
  bill.fuel = 999;
  bill.useThrusters(0, 6);
  test.deepEqual(bill.thrusters[0].channeled, 5);
  test.deepEqual(bill.thrusters[1].channeled, 1);
});

test("it uses thrusters properly, when one thruster heats faster", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;

  const thruster = getThruster(0, 5);
  thruster.addCritical(new ThrustChannelHeatIncreased(1));
  ship.systems.addPrimarySystem([getThruster(0, 5), thruster]);

  const bill = new ThrustBill(ship, []);
  bill.fuel = 999;
  bill.useThrusters(0, 6);
  test.deepEqual(bill.thrusters[0].channeled, 4);
  test.deepEqual(bill.thrusters[1].channeled, 2);
});

test("it uses thrusters properly, when one thruster has output reduced", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;

  const thruster = getThruster(0, 5);
  thruster.addCritical(new OutputReduced(4));
  ship.systems.addPrimarySystem([getThruster(0, 5), thruster]);

  const bill = new ThrustBill(ship, []);
  bill.fuel = 999;
  bill.useThrusters(0, 6);
  test.deepEqual(bill.thrusters[0].channeled, 5);
  test.deepEqual(bill.thrusters[1].channeled, 1);
});

test("It manages to pay a simple manouver", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;

  ship.systems.addPrimarySystem([getThruster(0, 3), getThruster(3, 3)]);

  const moves = [
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 3),
  ];

  const bill = new ThrustBill(ship, moves);
  bill.fuel = 999;
  test.true(bill.pay());
});

test("It uses manouveringThrusters correctly", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;
  ship.rollcost = 3;
  ship.pivotcost = 3;
  ship.evasioncost = 3;

  ship.systems.addPrimarySystem([getManouveringThruster(6, 3)]);

  const moves = [
    new MovementOrder(
      null,
      movementTypes.ROLL,
      new hexagon.Offset(0, 0),
      new hexagon.Offset(0, 0),
      0,
      true,
      999,
      true
    ),
    new MovementOrder(
      null,
      movementTypes.ROLL,
      new hexagon.Offset(0, 0),
      new hexagon.Offset(0, 0),
      0,
      true,
      999,
      1
    ),
  ];

  const bill = new ThrustBill(ship, moves);
  bill.fuel = 999;
  test.true(bill.pay());
  bill.getMoves();
});

test("It uses manouveringThrusters correctly when there is only directional thruster", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;
  ship.rollcost = 3;
  ship.pivotcost = 3;
  ship.evasioncost = 2;

  ship.systems.addPrimarySystem([
    new ManeuveringThrusterLeft({ id: 101, hitpoints: 10, armor: 3 }, 4, 2),
    new ManeuveringThrusterRight({ id: 102, hitpoints: 10, armor: 3 }, 4, 2),
  ]);

  const moves = [
    new MovementOrder(
      null,
      movementTypes.EVADE,
      new hexagon.Offset(0, 0),
      new hexagon.Offset(0, 0),
      0,
      true,
      999,
      1
    ),
    new MovementOrder(
      null,
      movementTypes.EVADE,
      new hexagon.Offset(0, 0),
      new hexagon.Offset(0, 0),
      0,
      true,
      999,
      1
    ),
    new MovementOrder(
      null,
      movementTypes.PIVOT,
      new hexagon.Offset(0, 0),
      new hexagon.Offset(0, 0),
      1,
      true,
      999,
      1
    ),
  ];

  const bill = new ThrustBill(ship, moves);
  bill.fuel = 999;
  test.true(bill.pay());
  bill.getMoves();
});
