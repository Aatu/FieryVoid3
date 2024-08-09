import test from "ava";
import CargoBay from "../../model/unit/system/cargo/CargoBay";
import Torpedo158MSV from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo158MSV";
import Torpedo158Nuclear from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo158Nuclear";

test("Cargo bay can store stuff", (test) => {
  const torpedo1 = new Torpedo158MSV();
  const torpedo2 = new Torpedo158Nuclear();

  const cargoBay = new CargoBay({ id: 1, hitpoints: 20, armor: 4 }, 50);

  cargoBay.callHandler("addCargo", { object: torpedo1, amount: 2 });
  cargoBay.callHandler("addCargo", { object: torpedo2, amount: 1 });

  const newCargoBay = new CargoBay(
    { id: 1, hitpoints: 20, armor: 4 },
    50
  ).deserialize(cargoBay.serialize());

  test.true(
    newCargoBay.callHandler("hasCargo", { object: torpedo1, amount: 2 })
  );
  test.false(
    newCargoBay.callHandler("hasCargo", { object: torpedo1, amount: 3 })
  );

  test.true(
    newCargoBay.callHandler("hasCargo", { object: torpedo2, amount: 1 })
  );
  test.false(
    newCargoBay.callHandler("hasCargo", { object: torpedo2, amount: 2 })
  );

  newCargoBay.callHandler("removeCargo", { object: torpedo2, amount: 1 });
  test.false(
    newCargoBay.callHandler("hasCargo", { object: torpedo2, amount: 1 })
  );

  newCargoBay.callHandler("removeCargo", { object: torpedo1, amount: 1 });
  test.false(
    newCargoBay.callHandler("hasCargo", { object: torpedo1, amount: 2 })
  );
  test.true(
    newCargoBay.callHandler("hasCargo", { object: torpedo1, amount: 1 })
  );
});
