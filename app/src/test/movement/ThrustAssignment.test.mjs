import test from "ava";
import ThrustAssignment from "../../model/movement/ThrustAssignment.mjs";
import Thruster from "../../model/unit/system/thruster/Thruster.mjs";

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

test("isDirection", test => {
  const thrustAssignment = new ThrustAssignment(getThruster(0, 6));
  test.true(thrustAssignment.isDirection(0));
  test.false(thrustAssignment.isDirection(3));
});

test("getDamageLevel", test => {
  const thrustAssignment = new ThrustAssignment(getThruster(0, 6));
  test.deepEqual(thrustAssignment.getDamageLevel(), 0);

  const thrustAssignment2 = new ThrustAssignment(
    getThruster(0, 6, [FirstThrustIgnored])
  );

  test.deepEqual(thrustAssignment2.getDamageLevel(), 1);
  thrustAssignment2.channel(1);
  test.deepEqual(thrustAssignment2.getDamageLevel(), 0);

  const thrustAssignment3 = new ThrustAssignment(
    getThruster(0, 6, [EfficiencyHalved])
  );
  test.deepEqual(thrustAssignment3.getDamageLevel(), 2);

  const thrustAssignment4 = new ThrustAssignment(
    getThruster(0, 6, [EfficiencyHalved, FirstThrustIgnored])
  );

  test.deepEqual(thrustAssignment4.getDamageLevel(), 3);
  thrustAssignment4.channel(1);
  test.deepEqual(thrustAssignment4.getDamageLevel(), 2);
});

test("getCost, no damage, no overthrust", test => {
  const thrustAssignment = new ThrustAssignment(getThruster(0, 6));
  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 6);
  test.deepEqual(overCapacity, 6);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 1);
});

test("channel wihtout overthrusting", test => {
  const thrustAssignment = new ThrustAssignment(getThruster(0, 6));

  const { channeled, overChanneled, cost } = thrustAssignment.channel(3);

  test.deepEqual(channeled, 3);
  test.deepEqual(overChanneled, 0);
  test.deepEqual(cost, 3);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 3);
  test.deepEqual(overCapacity, 6);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 1);
});

test("overchannel a lot", test => {
  const thrustAssignment = new ThrustAssignment(getThruster(0, 6));

  const { channeled, overChanneled, cost } = thrustAssignment.overChannel(9);

  test.deepEqual(channeled, 6);
  test.deepEqual(overChanneled, 3);
  test.deepEqual(cost, 9);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 0);
  test.deepEqual(overCapacity, 3);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 1);
});

test("channel more than capacity", test => {
  const thrustAssignment = new ThrustAssignment(getThruster(0, 6));

  const { channeled, overChanneled, cost } = thrustAssignment.channel(9);

  test.deepEqual(channeled, 6);
  test.deepEqual(overChanneled, 0);
  test.deepEqual(cost, 6);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 0);
  test.deepEqual(overCapacity, 6);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 1);
});

test("over channel more than capacity", test => {
  const thrustAssignment = new ThrustAssignment(getThruster(0, 6));

  const { channeled, overChanneled, cost } = thrustAssignment.overChannel(19);

  test.deepEqual(channeled, 6);
  test.deepEqual(overChanneled, 6);
  test.deepEqual(cost, 12);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 0);
  test.deepEqual(overCapacity, 0);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 1);
});

test("capacity with damaged thruster correct", test => {
  const thrustAssignment = new ThrustAssignment(
    getThruster(0, 6, [FirstThrustIgnored])
  );

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 6);
  test.deepEqual(overCapacity, 0);
  test.deepEqual(extraCost, 1);
  test.deepEqual(costMultiplier, 1);
});

test("channel with first thrust ignored thruster", test => {
  const thrustAssignment = new ThrustAssignment(
    getThruster(0, 6, [FirstThrustIgnored])
  );

  const { channeled, overChanneled, cost } = thrustAssignment.channel(2);

  test.deepEqual(channeled, 2);
  test.deepEqual(overChanneled, 0);
  test.deepEqual(cost, 3);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 4);
  test.deepEqual(overCapacity, 0);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 1);
});

test("second channel with first thrust ignored causes no extra cost", test => {
  const thrustAssignment = new ThrustAssignment(
    getThruster(0, 6, [FirstThrustIgnored])
  );

  thrustAssignment.channel(2);
  const { channeled, overChanneled, cost } = thrustAssignment.channel(2);

  test.deepEqual(channeled, 2);
  test.deepEqual(overChanneled, 0);
  test.deepEqual(cost, 2);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 2);
  test.deepEqual(overCapacity, 0);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 1);
});

test("half efficiency doubles the cost", test => {
  const thrustAssignment = new ThrustAssignment(
    getThruster(0, 6, [EfficiencyHalved])
  );

  const { channeled, overChanneled, cost } = thrustAssignment.channel(4);

  test.deepEqual(channeled, 4);
  test.deepEqual(overChanneled, 0);
  test.deepEqual(cost, 8);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 2);
  test.deepEqual(overCapacity, 0);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 2);
});

test("half efficiency and first thrust ignores combine properly", test => {
  const thrustAssignment = new ThrustAssignment(
    getThruster(0, 6, [EfficiencyHalved, FirstThrustIgnored])
  );

  const { channeled, overChanneled, cost } = thrustAssignment.channel(4);

  test.deepEqual(channeled, 4);
  test.deepEqual(overChanneled, 0);
  test.deepEqual(cost, 9);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 2);
  test.deepEqual(overCapacity, 0);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 2);
});

test("half efficiency and first thrust ignored counts first only once", test => {
  const thrustAssignment = new ThrustAssignment(
    getThruster(0, 6, [EfficiencyHalved, FirstThrustIgnored])
  );

  thrustAssignment.channel(2);
  const { channeled, overChanneled, cost } = thrustAssignment.channel(4);

  test.deepEqual(channeled, 4);
  test.deepEqual(overChanneled, 0);
  test.deepEqual(cost, 8);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 0);
  test.deepEqual(overCapacity, 0);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 2);
});

test("undoing channel works and returns refund", test => {
  const thrustAssignment = new ThrustAssignment(getThruster(0, 6));

  thrustAssignment.channel(2);
  const { refund } = thrustAssignment.undoChannel(2);

  test.deepEqual(refund, 2);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 6);
  test.deepEqual(overCapacity, 6);
  test.deepEqual(extraCost, 0);
  test.deepEqual(costMultiplier, 1);
});

test("undoing throws if trying to undo more than channeled", test => {
  const thrustAssignment = new ThrustAssignment(getThruster(0, 6));

  thrustAssignment.channel(2);
  const error = test.throws(() => thrustAssignment.undoChannel(4));
  test.is(error.message, "Can not undo channel more than channeled");
});

test("undoing channel refunds first thrust ignored", test => {
  const thrustAssignment = new ThrustAssignment(
    getThruster(0, 6, [FirstThrustIgnored])
  );

  thrustAssignment.channel(2);
  const { refund } = thrustAssignment.undoChannel(1);

  test.deepEqual(refund, 1);

  const { refund: refund2 } = thrustAssignment.undoChannel(1);

  test.deepEqual(refund2, 2);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 6);
  test.deepEqual(overCapacity, 0);
  test.deepEqual(extraCost, 1);
  test.deepEqual(costMultiplier, 1);
});

test("undoing channel refunds first thrust ignored with damage level 3", test => {
  const thrustAssignment = new ThrustAssignment(
    getThruster(0, 6, [FirstThrustIgnored, EfficiencyHalved])
  );

  const { cost } = thrustAssignment.channel(2);
  test.deepEqual(cost, 5);
  const { refund } = thrustAssignment.undoChannel(1);

  test.deepEqual(refund, 2);

  const { refund: refund2 } = thrustAssignment.undoChannel(1);

  test.deepEqual(refund2, 3);

  const {
    capacity,
    overCapacity,
    extraCost,
    costMultiplier
  } = thrustAssignment.getThrustCapacity();

  test.deepEqual(capacity, 6);
  test.deepEqual(overCapacity, 0);
  test.deepEqual(extraCost, 1);
  test.deepEqual(costMultiplier, 2);
});

test("Channel cost should be right", test => {
  const thrustAssignment1 = new ThrustAssignment(
    getThruster(0, 6, [FirstThrustIgnored])
  );
  const thrustAssignment2 = new ThrustAssignment(
    getThruster(0, 6, [EfficiencyHalved])
  );
  const thrustAssignment3 = new ThrustAssignment(
    getThruster(0, 6, [FirstThrustIgnored, EfficiencyHalved])
  );

  test.deepEqual(thrustAssignment1.channel(2).cost, 3);
  test.deepEqual(thrustAssignment1.channel(2).cost, 2);
  test.deepEqual(thrustAssignment2.channel(2).cost, 4);
  test.deepEqual(thrustAssignment2.channel(2).cost, 4);
  test.deepEqual(thrustAssignment3.channel(2).cost, 5);
  test.deepEqual(thrustAssignment3.channel(2).cost, 4);
});
