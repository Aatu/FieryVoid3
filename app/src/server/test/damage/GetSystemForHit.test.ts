import { expect, test } from "vitest";
import { Offset } from "../../../model/src/hexagon";
import { MOVEMENT_TYPE, MovementOrder } from "../../../model/src/movement";
import Ship from "../../../model/src/unit/Ship";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import { Engine } from "../../../model/src/unit/system/engine";
import { Reactor } from "../../../model/src/unit/system/reactor";
import { Structure } from "../../../model/src/unit/system/structure";
import { PDC30mm } from "../../../model/src/unit/system/weapon/pdc";
import { ShipSystemType } from "../../../model/src/unit/system/ShipSystem";
import { Radiator10x40 } from "../../../model/src/unit/system/heat";

const constructShip = (id: string = "123") => {
  let ship = new Ship({
    id,
  });
  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 300, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addAftSystem([
    new Reactor({ id: 401, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 400, hitpoints: 50, armor: 4 }),
  ]);

  return ship;
};

const constructNoStructureShip = (id: string = "123") => {
  let ship = new Ship({
    id,
  });

  ship.systems.addFrontSystem([
    new PDC30mm({ id: 101, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
  ]);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 300, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 }),
  ]);

  return ship;
};

test("Returns systems available for hit with structures blocking", (test) => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  expect(
    ship.systems
      .getSystemsForOuterHit(shooter.getPosition(), null)
      .map((system) => system.id)
      .sort()
  ).toEqual([400, 501, 500].sort());
});

test("Returns systems available for hit when looking for internal systems", (test) => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  expect(
    ship.systems
      .getSystemsForInnerHit(ship.systems.sections.getAftSection()!)
      .map((system) => system.id)
      .sort()
  ).toEqual([401].sort());
});

test("Returns systems available for hit ignoring destroyed structures", (test) => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  ship.systems.getSystemById(400).addDamage(new DamageEntry(100, 0));

  expect(
    ship.systems
      .getSystemsForOuterHit(shooter.getPosition(), null)
      .map((system) => system.id)
      .sort()
  ).toEqual([501, 401, 500, 300, 301].sort());
});

test("Ignores section when looking for overkill system", (test) => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  expect(
    ship.systems
      .getSystemsForOuterHit(
        shooter.getPosition(),
        ship.systems.sections.getPortAftSection()!
      )
      .map((system) => system.id)
      .sort()
  ).toEqual([8].sort());
});

test("Ignores destroyed section when looking for overkill system", (test) => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const structure = ship.systems.getSystemById(500);
  structure.addDamage(new DamageEntry(500, 0));

  expect(
    ship.systems
      .getSystemsForOuterHit(
        shooter.getPosition(),
        ship.systems.sections.getSectionBySystem(structure)
      )
      .map((system) => system.id)
      .sort()
  ).toEqual([8].sort());

  expect(
    ship.systems
      .getSystemsForInnerHit(ship.systems.sections.getPrimarySection()!)
      .map((system) => system.id)
      .sort()
  ).toEqual([6, 7].sort());
});

test("Penetrates whole ship if no structures intevene", (test) => {
  const ship = constructNoStructureShip();
  ship.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      1,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const structure = ship.systems.getSystemById(400);

  expect(
    ship.systems
      .getSystemsForOuterHit(
        shooter.getPosition(),
        ship.systems.sections.getSectionBySystem(structure)
      )
      .map((system) => system.id)
      .sort()
  ).toEqual([6, 7, 101].sort());
});

test("Outer hit includes always targetable system", () => {
  const ship = constructShip();

  ship.systems.addStarboardAftSystem(
    new Radiator10x40({ id: 666, hitpoints: 5, armor: 3 })
  );

  ship.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  expect(
    ship.systems
      .getSystemsForOuterHit(shooter.getPosition(), null)
      .map((system) => system.id)
      .sort()
  ).toEqual([400, 501, 500, 666].sort());

  expect(
    ship.systems
      .getSystemsForOuterHit(
        shooter.getPosition(),
        ship.systems.sections.getPortAftSection()!,
        true
      )
      .map((system) => system.id)
      .sort()
  ).toEqual([8].sort());
});

test("Systems that are internals when ofline are properly seleced", (test) => {
  const ship = constructShip();

  const pdc = new PDC30mm(
    { id: 666, hitpoints: 5, armor: 3 },
    { start: 0, end: 0 }
  );
  ship.systems.addAftSystem(pdc);
  ship.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  expect(
    ship.systems
      .getSystemsForOuterHit(shooter.getPosition(), null)
      .map((system) => system.id)
      .sort()
  ).toEqual([400, 501, 500, 666].sort());

  pdc.power.setOffline();

  expect(
    ship.systems
      .getSystemsForOuterHit(shooter.getPosition(), null)
      .map((system) => system.id)
      .sort()
  ).toEqual([400, 501, 500].sort());
});

/*
test("No penetrable section available", (test) => {
  const ship = new Ship({
    id: "999",
  });

  ship.systems.addFrontSystem([
    new Structure({ id: 100, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Structure({ id: 300, hitpoints: 50, armor: 4 }),
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 }),
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      null,
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  const structure = ship.systems.getSystemById(100);

  expect(
    ship.systems
      .getSystemsForHit(
        shooter.getPosition(),
        ship.systems.sections.getSectionBySystem(structure)
      )
      .map((system) => system.id)
  ).toEqual([]);
 
});
 */
