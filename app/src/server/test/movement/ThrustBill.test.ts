import { expect, test } from "vitest";
import ManeuveringThruster from "../../../model/src/unit/system/thruster/ManeuveringThruster";
import Critical from "../../../model/src/unit/system/criticals/Critical";
import Thruster from "../../../model/src/unit/system/thruster/Thruster";
import Ship from "../../../model/src/unit/Ship";
import {
  MOVEMENT_TYPE,
  MovementOrder,
  ThrustBill,
} from "../../../model/src/movement";
import Offset from "../../../model/src/hexagon/Offset";
import ThrustChannelHeatIncreased from "../../../model/src/unit/system/criticals/ThrustChannelHeatIncreased";
import OutputReduced from "../../../model/src/unit/system/criticals/OutputReduced";
import ManeuveringThrusterLeft from "../../../model/src/unit/system/thruster/ManeuveringThrusterLeft";
import ManeuveringThrusterRight from "../../../model/src/unit/system/thruster/ManeuveringThrusterRight";

let id = 0;

const getManouveringThruster = (
  output = 3,
  evasion = 0,
  criticals: (typeof Critical)[] = []
) => {
  id++;

  const thruster = new ManeuveringThruster(
    { id, hitpoints: 10, armor: 3 },
    output,
    evasion
  );
  criticals.forEach((crit) => thruster.addCritical(new crit()));
  return thruster;
};

const getThruster = (
  direction: number | number[] = 0,
  output = 3,
  criticals: (typeof Critical)[] = []
) => {
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

const getMovementOrder = (
  type: MOVEMENT_TYPE = MOVEMENT_TYPE.SPEED,
  facing = 0,
  value = 0
) =>
  new MovementOrder(
    null,
    type,
    new Offset(0, 0),
    new Offset(0, 0),
    facing,
    false,
    1,
    value,
    null
  );

test("simple speed move", (test) => {
  const moves = [getMovementOrder(MOVEMENT_TYPE.SPEED, 0, 0)];
  const bill = new ThrustBill(ship, moves);
  bill["fuel"] = 999;
  expect(bill["directionsRequired"]).toEqual({
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
    getMovementOrder(MOVEMENT_TYPE.SPEED, 0, 0),
    getMovementOrder(MOVEMENT_TYPE.SPEED, 0, 3),
    getMovementOrder(MOVEMENT_TYPE.SPEED, 0, 1),
    getMovementOrder(MOVEMENT_TYPE.SPEED, 0, 2),
    getMovementOrder(MOVEMENT_TYPE.SPEED, 0, 4),
    getMovementOrder(MOVEMENT_TYPE.SPEED, 0, 4),
    getMovementOrder(MOVEMENT_TYPE.SPEED, 0, 5),
  ];
  const bill = new ThrustBill(ship, moves);
  expect(bill["directionsRequired"]).toEqual({
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
  bill["fuel"] = 999;
  bill.useThrusters(0, 5);
  expect(bill["thrusters"][0].channeled).toBe(2);
  expect(bill["thrusters"][1].channeled).toBe(3);
});

test("it uses thrusters properly, with one thruster already overheating", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;

  const thruster = getThruster(0, 5);
  thruster.heat["overheat"] = 2;
  ship.systems.addPrimarySystem([getThruster(0, 5), thruster]);

  const bill = new ThrustBill(ship, []);
  bill["fuel"] = 999;
  bill.useThrusters(0, 6);
  expect(bill["thrusters"][0].channeled).toBe(5);
  expect(bill["thrusters"][1].channeled).toBe(1);
});

test("it uses thrusters properly, when one thruster heats faster", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;

  const thruster = getThruster(0, 5);
  thruster.addCritical(new ThrustChannelHeatIncreased(1));
  ship.systems.addPrimarySystem([getThruster(0, 5), thruster]);

  const bill = new ThrustBill(ship, []);
  bill["fuel"] = 999;
  bill.useThrusters(0, 6);
  expect(bill["thrusters"][0].channeled).toBe(4);
  expect(bill["thrusters"][1].channeled).toBe(2);
});

test.only("it uses thrusters properly, when one thruster has output reduced", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;

  const thruster = getThruster(0, 5);
  thruster.addCritical(new OutputReduced(4));
  ship.systems.addPrimarySystem([getThruster(0, 5), thruster]);

  const bill = new ThrustBill(ship, []);
  bill["fuel"] = 999;
  bill.useThrusters(0, 6);
  expect(bill["thrusters"][0].channeled).toBe(5);
  expect(bill["thrusters"][1].channeled).toBe(1);
});

test("It manages to pay a simple manouver", (test) => {
  ship = new Ship();
  ship.movement.isRolled = () => false;

  ship.accelcost = 3;

  ship.systems.addPrimarySystem([getThruster(0, 3), getThruster(3, 3)]);

  const moves = [
    getMovementOrder(MOVEMENT_TYPE.SPEED, 0, 0),
    getMovementOrder(MOVEMENT_TYPE.SPEED, 0, 3),
  ];

  const bill = new ThrustBill(ship, moves);
  bill["fuel"] = 999;
  expect(bill.pay()).toBe(true);
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
      MOVEMENT_TYPE.ROLL,
      new Offset(0, 0),
      new Offset(0, 0),
      0,
      true,
      999,
      true
    ),
    new MovementOrder(
      null,
      MOVEMENT_TYPE.ROLL,
      new Offset(0, 0),
      new Offset(0, 0),
      0,
      true,
      999,
      1
    ),
  ];

  const bill = new ThrustBill(ship, moves);
  bill["fuel"] = 999;
  expect(bill.pay()).toBe(true);
  bill.getMoves();
});

test("It uses manouveringThrusters correctly when there is only directional thruster", () => {
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
      MOVEMENT_TYPE.EVADE,
      new Offset(0, 0),
      new Offset(0, 0),
      0,
      true,
      999,
      1
    ),
    new MovementOrder(
      null,
      MOVEMENT_TYPE.EVADE,
      new Offset(0, 0),
      new Offset(0, 0),
      0,
      true,
      999,
      1
    ),
    new MovementOrder(
      null,
      MOVEMENT_TYPE.PIVOT,
      new Offset(0, 0),
      new Offset(0, 0),
      1,
      true,
      999,
      1
    ),
  ];

  const bill = new ThrustBill(ship, moves);
  bill["fuel"] = 999;
  expect(bill.pay()).toBe(true);
  bill.getMoves();
});
