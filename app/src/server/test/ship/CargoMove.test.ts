import { expect, test } from "vitest";
import CargoBay from "../../../model/src/unit/system/cargo/CargoBay";
import { CargoEntry } from "../../../model/src/cargo/CargoEntry";
import { Torpedo158HE } from "../../../model/src/unit/system/weapon/ammunition/torpedo";
import {
  Ammo140mmAP,
  Ammo30mm,
  Ammo85mmAP,
} from "../../../model/src/unit/system/weapon/ammunition/conventional";
import { CargoMove } from "../../../model/src/cargo/CargoMove";
import {
  addCargos,
  compareCargos,
  subtractCargos,
} from "../../../model/src/unit/ShipCargo";

test("Cargo move can be modified", () => {
  const from = new CargoBay({ id: 1, hitpoints: 20, armor: 4 }, 150);
  const to = new CargoBay({ id: 2, hitpoints: 20, armor: 4 }, 150);

  const initialCargo = [
    new CargoEntry(new Torpedo158HE(), 5),
    new CargoEntry(new Ammo30mm(), 400),
  ];

  const move = new CargoMove(from, to, initialCargo, 5);

  expect(move.cargoToMove).toBe(initialCargo);

  move.modify(new CargoEntry(new Torpedo158HE(), 1));

  expect(move.cargoToMove).toEqual([
    new CargoEntry(new Torpedo158HE(), 6),
    new CargoEntry(new Ammo30mm(), 400),
  ]);

  const left = move.modify(new CargoEntry(new Torpedo158HE(), -7));

  expect(move.cargoToMove).toEqual([new CargoEntry(new Ammo30mm(), 400)]);

  expect(left).toEqual(new CargoEntry(new Torpedo158HE(), -1));
});

test("Cargo move will discard stuff until it fits", () => {
  const from = new CargoBay({ id: 1, hitpoints: 20, armor: 4 }, 150);
  const to = new CargoBay({ id: 2, hitpoints: 20, armor: 4 }, 150);

  const initialCargo = [
    new CargoEntry(new Ammo85mmAP(), 300),
    new CargoEntry(new Ammo30mm(), 400),
  ];

  const move = new CargoMove(from, to, initialCargo, 5);
  move.discardUntilFits(10);

  expect(move.getTotalSpaceRequired()).toBeLessThanOrEqual(10);
});

test("Cargo can be compared", () => {
  const current = [
    new CargoEntry(new Ammo85mmAP(), 300),
    new CargoEntry(new Ammo30mm(), 400),
  ];

  expect(
    compareCargos(current, [
      new CargoEntry(new Ammo85mmAP(), 200),
      new CargoEntry(new Ammo30mm(), 200),
    ])
  ).toEqual([
    new CargoEntry(new Ammo85mmAP(), 100),
    new CargoEntry(new Ammo30mm(), 200),
  ]);

  expect(
    compareCargos(current, [
      new CargoEntry(new Ammo85mmAP(), 500),
      new CargoEntry(new Ammo30mm(), 200),
    ])
  ).toEqual([
    new CargoEntry(new Ammo85mmAP(), -200),
    new CargoEntry(new Ammo30mm(), 200),
  ]);

  expect(compareCargos(current, [])).toEqual([
    new CargoEntry(new Ammo85mmAP(), -300),
    new CargoEntry(new Ammo30mm(), -400),
  ]);
});

test("Check if another cargo move cancels other", () => {
  const from = new CargoBay({ id: 1, hitpoints: 20, armor: 4 }, 150);
  const to = new CargoBay({ id: 2, hitpoints: 20, armor: 4 }, 150);

  const current = [
    new CargoEntry(new Ammo85mmAP(), 300),
    new CargoEntry(new Ammo30mm(), 400),
  ];

  const move = new CargoMove(from, to, current, 5);

  const modifiedCargo = move.checkIfCounterMove(
    to,
    from,
    [new CargoEntry(new Ammo85mmAP(), 100)],
    true
  );

  expect(modifiedCargo).toEqual([]);

  expect(move.cargoToMove).toEqual([
    new CargoEntry(new Ammo85mmAP(), 200),
    new CargoEntry(new Ammo30mm(), 400),
  ]);

  const modifiedCargo2 = move.checkIfCounterMove(
    to,
    from,
    [
      new CargoEntry(new Ammo85mmAP(), 300),
      new CargoEntry(new Ammo140mmAP(), 100),
    ],
    true
  );

  expect(modifiedCargo2).toEqual([
    new CargoEntry(new Ammo85mmAP(), 100),
    new CargoEntry(new Ammo140mmAP(), 100),
  ]);

  //To and From swapped
  const modifiedCargo3 = move.checkIfCounterMove(
    from,
    to,
    [
      new CargoEntry(new Ammo85mmAP(), 300),
      new CargoEntry(new Ammo140mmAP(), 100),
    ],
    true
  );

  expect(modifiedCargo3).toEqual([
    new CargoEntry(new Ammo85mmAP(), 300),
    new CargoEntry(new Ammo140mmAP(), 100),
  ]);

  const modifiedCargo4 = move.checkIfCounterMove(
    from,
    to,
    [new CargoEntry(new Ammo140mmAP(), 100)],
    true
  );

  expect(modifiedCargo4).toEqual([new CargoEntry(new Ammo140mmAP(), 100)]);
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
