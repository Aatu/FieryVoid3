import test from "ava";
import Ship from "../../model/unit/Ship.mjs";
import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";

import {
  FirstThrustIgnored,
  EfficiencyHalved
} from "../../model/unit/system/criticals";

const constructShip = (id = 123) => {
  let ship = new Ship({
    id,
    accelcost: 3
  });
  ship.systems.addPrimarySystem([
    new Thruster({ id: 1, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 2, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 3, hitpoints: 10, armor: 3 }, 5, 3),
    new Thruster({ id: 4, hitpoints: 10, armor: 3 }, 5, 3),
    new Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20)
  ]);

  return ship;
};

test("Ship systems serializes and deserializes nicely", test => {
  let ship = constructShip(73);

  ship.systems.getSystemById(1).addCritical(new FirstThrustIgnored());
  ship.systems.getSystemById(1).addDamage(new DamageEntry(3));
  ship.systems.getSystemById(3).addDamage(new DamageEntry(10));
  ship.systems.getSystemById(5).power.setOffline();

  const serialized = ship.serialize();

  let ship2 = constructShip().deserialize(serialized);
  test.true(ship2.systems.getSystemById(1).hasCritical(FirstThrustIgnored));
  test.is(ship2.systems.getSystemById(1).getTotalDamage(), 3);
  test.true(ship2.systems.getSystemById(3).isDestroyed());
  test.true(ship2.systems.getSystemById(5) instanceof Engine);
  test.true(ship2.systems.getSystemById(5).power.isOffline());
});
