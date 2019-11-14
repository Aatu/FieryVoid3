import test from "ava";
import ShipSystem from "../../model/unit/system/ShipSystem.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import FirstThrustIgnored from "../../model/unit/system/criticals/FirstThrustIgnored.mjs";

test("System takes damage and is destroyed", test => {
  const system = new ShipSystem({ id: 123, hitpoints: 10, armor: 3 });
  system.addDamage(new DamageEntry(3));
  test.false(system.isDestroyed());
  test.deepEqual(system.getTotalDamage(), 3);
  system.addDamage(new DamageEntry(7));
  test.true(system.isDestroyed());
});

test("System takes critical damage", test => {
  const system = new ShipSystem({ id: 123, hitpoints: 10, armor: 3 });
  system.addCritical(new FirstThrustIgnored());
  test.true(system.hasCritical(FirstThrustIgnored));
});

test("Critical with duration disappears when turn changes", test => {
  const system = new ShipSystem({ id: 123, hitpoints: 10, armor: 3 });
  const testCrit = new FirstThrustIgnored();
  testCrit.duration = 1;
  system.addCritical(testCrit);
  test.true(system.hasCritical(FirstThrustIgnored));
  system.advanceTurn();
  test.false(system.hasCritical(FirstThrustIgnored));
});

test("Stuff serializes and deserializes nicely", test => {
  const system = new ShipSystem({ id: 123, hitpoints: 10, armor: 3 });
  const testCrit = new FirstThrustIgnored();
  system.addCritical(testCrit);
  system.addDamage(new DamageEntry(3));

  const serialized = system.serialize();

  const system2 = new ShipSystem({
    id: 123,
    hitpoints: 10,
    armor: 3
  }).deserialize(serialized);
  test.deepEqual(system, system2);
});

test("Ship system gets destroyed", test => {
  const system = new ShipSystem({ id: 123, hitpoints: 10, armor: 3 });

  const damage = new DamageEntry(10, 3);
  system.addDamage(damage);
  test.true(damage.destroyedSystem);
  test.true(system.isDestroyed());

  const newSystem = new ShipSystem({
    id: 123,
    hitpoints: 10,
    armor: 3
  }).deserialize(system.serialize());

  test.true(newSystem.damage.entries[0].destroyedSystem);
});
