import test from "ava";
import ThrustBill from "../../model/movement/ThrustBill.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import hexagon from "../../model/hexagon";
import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import Ship from "../../model/unit/Ship.mjs";

import {
  FirstThrustIgnored,
  EfficiencyHalved
} from "../../model/unit/system/criticals";

let id = 0;

const getThruster = (direction = 0, output = 3, criticals = []) => {
  id++;

  const thruster = new Thruster(
    { id, hitpoints: 10, armor: 3 },
    output,
    direction
  );
  criticals.forEach(crit => thruster.addCritical(new crit()));
  return thruster;
};

let ship = new Ship({
  accelcost: 3
});
ship.systems.addPrimarySystem([
  getThruster(0, 3),
  getThruster([1, 2], 3),
  getThruster(3, 3),
  getThruster([4, 5], 3)
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

test("simple speed move", test => {
  const moves = [getMovementOrder("speed", 0, 0)];
  const bill = new ThrustBill(ship, 10, moves);
  test.deepEqual(bill.directionsRequired, {
    "0": 0,
    "3": 3,
    "1": 0,
    "2": 0,
    "4": 0,
    "5": 0,
    "6": 0
  });
});

test("multiple speed moves", test => {
  const moves = [
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 3),
    getMovementOrder("speed", 0, 1),
    getMovementOrder("speed", 0, 2),
    getMovementOrder("speed", 0, 4),
    getMovementOrder("speed", 0, 4),
    getMovementOrder("speed", 0, 5)
  ];
  const bill = new ThrustBill(ship, 10, moves);
  test.deepEqual(bill.directionsRequired, {
    "0": 3,
    "3": 3,
    "1": 6,
    "2": 3,
    "4": 3,
    "5": 3,
    "6": 0
  });
});

test("Returns false if it is clear that there is not enough thrust", test => {
  const moves = [
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 3),
    getMovementOrder("speed", 0, 1),
    getMovementOrder("speed", 0, 2),
    getMovementOrder("speed", 0, 4),
    getMovementOrder("speed", 0, 4),
    getMovementOrder("speed", 0, 5)
  ];
  const bill = new ThrustBill(ship, 10, moves);
  test.false(bill.pay());
});

test("it uses thrusters properly", test => {
  ship = new Ship({ accelcost: 3 });
  ship.systems.addPrimarySystem([
    getThruster(0, 3),
    getThruster(0, 3, [FirstThrustIgnored, EfficiencyHalved])
  ]);

  const bill = new ThrustBill(ship, 10, []);
  bill.useThrusters(0, 5, bill.thrusters, false);
  test.deepEqual(bill.thrusters[0].channeled, 3);
  test.deepEqual(bill.thrusters[1].channeled, 2);
  test.deepEqual(bill.cost, 8);
});

test("it uses thrusters properly, with overthrust", test => {
  ship = new Ship({ accelcost: 3 });
  ship.systems.addPrimarySystem([
    getThruster(0, 3),
    getThruster(0, 3, [FirstThrustIgnored, EfficiencyHalved])
  ]);

  const bill = new ThrustBill(ship, 10, []);
  bill.useThrusters(0, 5, bill.thrusters, true);
  test.deepEqual(bill.thrusters[0].channeled, 5);
  test.deepEqual(bill.thrusters[1].channeled, 0);
  test.deepEqual(bill.cost, 5);
});

test("It manages to pay a simple manouver", test => {
  ship = new Ship({ accelcost: 3 });
  ship.systems.addPrimarySystem([getThruster(0, 3), getThruster(3, 3)]);

  const moves = [
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 3)
  ];

  const bill = new ThrustBill(ship, 10, moves);
  test.true(bill.pay());
});

test("It manages to pay a simple manouver with overthrusting", test => {
  ship = new Ship({ accelcost: 3 });
  ship.systems.addPrimarySystem([getThruster(0, 3), getThruster(3, 3)]);

  const moves = [
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 3)
  ];

  const bill = new ThrustBill(ship, 10, moves);
  test.true(bill.pay());
});

test("It will use damaged thrusters", test => {
  ship = new Ship({ accelcost: 3 });
  ship.systems.addPrimarySystem([
    getThruster(0, 3),
    getThruster(0, 3, [FirstThrustIgnored]),
    getThruster(3, 3)
  ]);

  const moves = [
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 3),
    getMovementOrder("speed", 0, 3),
    getMovementOrder("speed", 0, 3)
  ];

  const bill = new ThrustBill(ship, 15, moves);
  const result = bill.pay();
  test.true(result);
  test.deepEqual(bill.cost, 13);
});

test("It gives thrusters in proper order", test => {
  ship = new Ship({ accelcost: 3 });
  ship.systems.addPrimarySystem([
    getThruster(0, 3),
    getThruster(0, 3, [FirstThrustIgnored]),
    getThruster(0, 4)
  ]);

  const moves = [
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 0)
  ];

  const bill = new ThrustBill(ship, 10, moves);
  const sortedThrusters = bill.getAllUsableThrusters(0);

  test.deepEqual(sortedThrusters.length, 3);
  test.deepEqual(sortedThrusters[0].capacity, 4);
  test.deepEqual(sortedThrusters[0].getDamageLevel(), 0);
  test.deepEqual(sortedThrusters[1].capacity, 3);
  test.deepEqual(sortedThrusters[1].getDamageLevel(), 0);
  test.deepEqual(sortedThrusters[2].capacity, 3);
  test.deepEqual(sortedThrusters[2].getDamageLevel(), 1);
});

test("It will rather use damaged thrusters than overthrust, if possible", test => {
  ship = new Ship({ accelcost: 3 });
  ship.systems.addPrimarySystem([
    getThruster(0, 3),
    getThruster(0, 3, [FirstThrustIgnored]),
    getThruster(3, 3)
  ]);

  const moves = [
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 3),
    getMovementOrder("speed", 0, 3)
  ];

  const bill = new ThrustBill(ship, 10, moves);
  test.true(bill.pay());
  test.deepEqual(bill.cost, 10);

  test.deepEqual(bill.thrusters[1].channeled, 3);
  test.deepEqual(bill.thrusters[0].channeled, 3);
  test.true(bill.thrusters[1].damaged);
});

test("No budget to reallocate all overthrust", test => {
  ship = new Ship({ accelcost: 3 });
  ship.systems.addPrimarySystem([
    getThruster(0, 3),
    getThruster(0, 3, [EfficiencyHalved]),
    getThruster(3, 3)
  ]);

  const moves = [
    getMovementOrder("speed", 0, 0),
    getMovementOrder("speed", 0, 3),
    getMovementOrder("speed", 0, 3)
  ];

  const bill = new ThrustBill(ship, 10, moves);
  test.true(bill.pay());
  test.deepEqual(bill.cost, 10);
  test.true(bill.isOverChanneled());

  test.deepEqual(bill.thrusters[1].channeled, 1);
  test.deepEqual(bill.thrusters[0].channeled, 5);
  test.true(bill.thrusters[1].damaged);

  const newMoves = bill.getMoves();

  expectDirectionsEmptyForRequiredThrust([0, 1, 2, 4, 5], newMoves[0], test);
  expectDirectionsEqualForRequiredThrust(3, newMoves[0], [3], test);

  expectDirectionsEmptyForRequiredThrust([3, 1, 2, 4, 5], newMoves[1], test);
  expectDirectionsEqualForRequiredThrust(0, newMoves[1], [3], test);

  expectDirectionsEmptyForRequiredThrust([3, 1, 2, 4, 5], newMoves[2], test);
  expectDirectionsEqualForRequiredThrust(0, newMoves[2], [2, 1], test);
});

const expectDirectionsEmptyForRequiredThrust = (directions, move, test) => {
  directions.forEach(direction => {
    test.deepEqual(move.requiredThrust.fullfilments[direction], []);
  });
};

const expectDirectionsEqualForRequiredThrust = (
  direction,
  move,
  equal,
  test
) => {
  move.requiredThrust.fullfilments[direction].forEach((entry, i) =>
    test.deepEqual(entry.amount, equal[i])
  );
};
