import { expect, test } from "vitest";
import Torpedo158MSV from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158MSV";
import Torpedo158Nuclear from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158Nuclear";
import CargoBay from "../../../model/src/unit/system/cargo/CargoBay";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";

test("Cargo bay can store stuff", () => {
  const torpedo1 = new Torpedo158MSV();
  const torpedo2 = new Torpedo158Nuclear();

  const cargoBay = new CargoBay({ id: 1, hitpoints: 20, armor: 4 }, 50);

  cargoBay.callHandler(
    SYSTEM_HANDLERS.addCargo,
    { object: torpedo1, amount: 2 },
    undefined
  );
  cargoBay.callHandler(
    SYSTEM_HANDLERS.addCargo,
    { object: torpedo2, amount: 1 },
    undefined
  );

  const newCargoBay = new CargoBay(
    { id: 1, hitpoints: 20, armor: 4 },
    50
  ).deserialize(cargoBay.serialize());

  expect(
    newCargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      { object: torpedo1, amount: 2 },
      undefined
    )
  ).toBe(true);

  expect(
    newCargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      { object: torpedo1, amount: 3 },
      undefined
    )
  ).toBe(false);

  expect(
    newCargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      { object: torpedo2, amount: 1 },
      undefined
    )
  ).toBe(true);
  expect(
    newCargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      { object: torpedo2, amount: 2 },
      undefined
    )
  ).toBe(false);

  newCargoBay.callHandler(
    SYSTEM_HANDLERS.removeCargo,
    { object: torpedo2, amount: 1 },
    undefined
  );

  expect(
    newCargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      { object: torpedo2, amount: 1 },
      undefined
    )
  ).toBe(false);

  newCargoBay.callHandler(
    SYSTEM_HANDLERS.removeCargo,
    { object: torpedo1, amount: 1 },
    undefined
  );

  expect(
    newCargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      { object: torpedo1, amount: 2 },
      undefined
    )
  ).toBe(false);
  expect(
    newCargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      { object: torpedo1, amount: 1 },
      undefined
    )
  ).toBe(true);
});
