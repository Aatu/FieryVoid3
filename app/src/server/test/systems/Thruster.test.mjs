import test from "ava";
import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";

test("Thruster can channel thrust", (test) => {
  const thruster = new Thruster({ id: 123, hitpoints: 10, armor: 3 }, 5, 0);
  test.deepEqual(thruster.callHandler("getThrustOutput"), 5);
});

test("Destroyed thruster channels nothing", (test) => {
  const thruster = new Thruster({ id: 123, hitpoints: 10, armor: 3 }, 5, 0);
  thruster.addDamage(new DamageEntry(50));
  test.deepEqual(thruster.callHandler("getThrustOutput"), 0);
});
