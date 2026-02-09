import { expect, test } from "vitest";
import CargoBay from "../../../model/src/unit/system/cargo/CargoBay";
import Torpedo158HE from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158HE";
import { CargoEntry } from "../../../model/src/cargo/CargoEntry";
import {
  Ammo30mm,
  Ammo85mmAP,
} from "../../../model/src/unit/system/weapon/ammunition/conventional";
import { BareTestShip } from "../../../model/src/unit/ships/test/TestShip";
import {
  addCargos,
  cargoContains,
  subtractCargos,
} from "../../../model/src/unit/ShipCargo";

test("Cargo can be compared", () => {
  const current = [
    new CargoEntry(new Ammo85mmAP(), 300),
    new CargoEntry(new Ammo30mm(), 400),
  ];

  expect(
    cargoContains(current, [
      new CargoEntry(new Ammo85mmAP(), 200),
      new CargoEntry(new Ammo30mm(), 200),
    ])
  ).toEqual(true);

  expect(
    cargoContains(current, [
      new CargoEntry(new Ammo85mmAP(), 500),
      new CargoEntry(new Ammo30mm(), 200),
    ])
  ).toEqual(false);

  expect(cargoContains(current, [])).toEqual(true);
});

test("Subtracting and adding cargos", () => {
  expect(
    subtractCargos(
      [new CargoEntry(new Torpedo158HE(), 10)],
      [new CargoEntry(new Torpedo158HE(), 2)]
    )
  ).toEqual([new CargoEntry(new Torpedo158HE(), 8)]);

  expect(
    addCargos(
      [new CargoEntry(new Torpedo158HE(), 10)],
      [new CargoEntry(new Torpedo158HE(), 2)]
    )
  ).toEqual([new CargoEntry(new Torpedo158HE(), 12)]);

  expect(
    subtractCargos(
      [new CargoEntry(new Torpedo158HE(), 10)],
      [
        new CargoEntry(new Torpedo158HE(), 2),
        new CargoEntry(new Ammo30mm(), 10),
      ]
    )
  ).toEqual([
    new CargoEntry(new Torpedo158HE(), 8),
    new CargoEntry(new Ammo30mm(), -10),
  ]);
});

test("Cargo can be moved", () => {
  const ship = new BareTestShip({ id: "123" });
  const from = new CargoBay({ id: 1000, hitpoints: 20, armor: 4 }, 150);
  const to = new CargoBay({ id: 2000, hitpoints: 20, armor: 4 }, 150);

  ship.systems.addPrimarySystem(from);
  ship.systems.addPrimarySystem(to);

  const initialCargo = [
    new CargoEntry(new Torpedo158HE(), 5),
    new CargoEntry(new Ammo30mm(), 400),
  ];

  const moveCargo = [
    new CargoEntry(new Torpedo158HE(), 2),
    new CargoEntry(new Ammo30mm(), 200),
  ];

  from.handlers.addCargo(initialCargo);

  ship.shipCargo.moveCargo(from, to, moveCargo);

  expect(
    to.handlers
      .getAllCargo()
      .map((c) => c.toString())
      .join(", ")
  ).toEqual("Torpedo158HE x 2, Ammo30mm x 200");

  expect(
    from.handlers
      .getAllCargo()
      .map((c) => c.toString())
      .join(", ")
  ).toEqual("Torpedo158HE x 3, Ammo30mm x 200");
});

test("Cargo can be randomly removed", () => {
  const ship = new BareTestShip({ id: "123" });
  const from = new CargoBay({ id: 1000, hitpoints: 20, armor: 4 }, 150);
  const to = new CargoBay({ id: 2000, hitpoints: 20, armor: 4 }, 150);

  ship.systems.addPrimarySystem(from);
  ship.systems.addPrimarySystem(to);

  from.handlers.addCargo([new CargoEntry(new Torpedo158HE(), 5)]);
  to.handlers.addCargo([new CargoEntry(new Torpedo158HE(), 5)]);

  expect(ship.shipCargo.hasCargo(new CargoEntry(new Torpedo158HE(), 6))).toBe(
    true
  );
  ship.shipCargo.removeCargo(new CargoEntry(new Torpedo158HE(), 6));

  const allCargo = ship.shipCargo
    .getAllCargo()
    .map((c) => c.toString())
    .join(", ");

  expect(allCargo).toEqual("Torpedo158HE x 4");
});

test("Cargo can be distributed to ship", () => {
  const ship = new BareTestShip({ id: "123" });
  const from = new CargoBay({ id: 1000, hitpoints: 20, armor: 4 }, 150);
  const to = new CargoBay({ id: 2000, hitpoints: 20, armor: 4 }, 150);

  ship.systems.addPrimarySystem(from);
  ship.systems.addPrimarySystem(to);

  from.handlers.addCargo([new CargoEntry(new Torpedo158HE(), 5)]);
  to.handlers.addCargo([new CargoEntry(new Torpedo158HE(), 5)]);

  ship.shipCargo.addCargo(new CargoEntry(new Torpedo158HE(), 6));

  const allCargo = ship.shipCargo
    .getAllCargo()
    .map((c) => c.toString())
    .join(", ");

  expect(allCargo).toEqual("Torpedo158HE x 16");
});
