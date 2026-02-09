import { expect, test } from "vitest";
import ShipSystem from "../../../model/src/unit/system/ShipSystem";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import ForcedOffline from "../../../model/src/unit/system/criticals/ForcedOffline";

test("System takes damage and is destroyed", (test) => {
  const system = new ShipSystem({ id: 123, hitpoints: 10, armor: 3 });
  system.addDamage(new DamageEntry(3));
  expect(system.isDestroyed()).toBe(false);
  expect(system.getTotalDamage()).toBe(3);
  system.addDamage(new DamageEntry(7));
  expect(system.isDestroyed()).toBe(true);
});

test("System takes critical damage", (test) => {
  const system = new ShipSystem({ id: 123, hitpoints: 10, armor: 3 });
  system.addCritical(new ForcedOffline(3));
  expect(system.hasCritical(ForcedOffline)).toBe(true);
});

test("Stuff serializes and deserializes nicely", (test) => {
  const system = new ShipSystem({ id: 123, hitpoints: 10, armor: 3 });
  const testCrit = new ForcedOffline(3);
  system.addCritical(testCrit);
  system.addDamage(new DamageEntry(3));

  const serialized = system.serialize();

  system.damage["entries"].forEach((entry) => (entry.new = false));

  const system2 = new ShipSystem({
    id: 123,
    hitpoints: 10,
    armor: 3,
  }).deserialize(serialized);
  expect(system).toEqual(system2);
});

test("Ship system gets destroyed", (test) => {
  const system = new ShipSystem({ id: 123, hitpoints: 10, armor: 3 });

  const damage = new DamageEntry(10, 3);
  system.addDamage(damage);
  expect(damage.destroyedSystem).toBe(true);
  expect(system.isDestroyed()).toBe(true);

  const newSystem = new ShipSystem({
    id: 123,
    hitpoints: 10,
    armor: 3,
  }).deserialize(system.serialize());

  expect(newSystem.damage["entries"][0].destroyedSystem).toBe(true);
});
