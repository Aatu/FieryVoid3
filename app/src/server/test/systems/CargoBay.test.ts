import { expect, test } from "vitest";
import Torpedo158MSV from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158MSV";
import Torpedo158Nuclear from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158Nuclear";
import CargoBay from "../../../model/src/unit/system/cargo/CargoBay";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import { CargoEntry } from "../../../model/src/cargo/CargoEntry";

test("Cargo bay can store stuff", () => {
  const torpedo1 = new Torpedo158MSV();
  const torpedo2 = new Torpedo158Nuclear();

  const cargoBay = new CargoBay({ id: 1, hitpoints: 20, armor: 4 }, 50);

  cargoBay.handlers.addCargo(new CargoEntry(torpedo1, 2));

  cargoBay.handlers.addCargo(new CargoEntry(torpedo2, 1));

  const newCargoBay = new CargoBay(
    { id: 1, hitpoints: 20, armor: 4 },
    50
  ).deserialize(cargoBay.serialize());

  expect(newCargoBay.handlers.getAllCargo()).toEqual([
    new CargoEntry(torpedo1, 2),
    new CargoEntry(torpedo2, 1),
  ]);

  newCargoBay.handlers.removeCargo(new CargoEntry(torpedo2, 1));

  expect(newCargoBay.handlers.getAllCargo()).toEqual([
    new CargoEntry(torpedo1, 2),
  ]);

  newCargoBay.handlers.removeCargo(new CargoEntry(torpedo1, 1));

  expect(newCargoBay.handlers.getAllCargo()).toEqual([
    new CargoEntry(torpedo1, 1),
  ]);

  newCargoBay.handlers.removeCargo(new CargoEntry(torpedo1, 1));

  expect(newCargoBay.handlers.getAllCargo()).toEqual([]);
});
