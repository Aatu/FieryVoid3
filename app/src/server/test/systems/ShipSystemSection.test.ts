import { expect, test } from "vitest";
import Ship from "../../../model/src/unit/Ship";
import Vector from "../../../model/src/utils/Vector";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import { MOVEMENT_TYPE } from "../../../model/src/movement";
import { Offset } from "../../../model/src/hexagon";
import { Engine } from "../../../model/src/unit/system/engine";
import { Reactor } from "../../../model/src/unit/system/reactor";
import ShipSystemSections from "../../../model/src/unit/system/ShipSystemSections";
import { Structure } from "../../../model/src/unit/system/structure";
import { Thruster } from "../../../model/src/unit/system/thruster";
import { systemsToNameIdString } from "../helpers";

const getShipWithStructures = (rolled = false) => {
  const ship = new Ship({});
  ship.getPosition = () => new Vector();
  ship.getFacing = () => 0;

  const startMove = new MovementOrder(
    "-1",
    MOVEMENT_TYPE.START,
    new Offset(0, 0),
    new Offset(0, 0),
    0,
    rolled,
    999,
    0,
    null,
    1
  );

  ship.movement.addMovement(startMove);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 1, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addFrontSystem([
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 12, 6),
    new Structure({ id: 2, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addAftSystem([
    new Thruster({ id: 58, hitpoints: 10, armor: 3 }, 12, 6),
    new Structure({ id: 52, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addPortFrontSystem([
    new Thruster({ id: 18, hitpoints: 10, armor: 3 }, 12, 6),
    new Structure({ id: 12, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addPortAftSystem([
    new Thruster({ id: 28, hitpoints: 10, armor: 3 }, 12, 6),
    new Structure({ id: 22, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addStarboardFrontSystem([
    new Thruster({ id: 38, hitpoints: 10, armor: 3 }, 12, 6),
    new Structure({ id: 32, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addStarboardAftSystem([
    new Thruster({ id: 48, hitpoints: 10, armor: 3 }, 12, 6),
    new Structure({ id: 42, hitpoints: 30, armor: 5 }),
  ]);

  return ship;
};

test("Gets correct heading", () => {
  const sections = new ShipSystemSections({
    movement: { isRolled: () => false },
  } as unknown as Ship);

  expect(
    sections.getHitSectionHeading(
      { x: 200, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      0
    )
  ).toBe(0);

  expect(
    sections.getHitSectionHeading(
      { x: 200, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      270
    )
  ).toBe(90);
  expect(
    sections.getHitSectionHeading(
      { x: 200, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      180
    )
  ).toBe(180);
});

test("Gets correct sections", () => {
  const ship = getShipWithStructures();
  expect(
    ship.systems.sections.getHitSections(
      { x: 200, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      0
    )
  ).toEqual([
    ship.systems.sections.getFrontSection(),
    ship.systems.sections.getPortFrontSection(),
    ship.systems.sections.getStarboardFrontSection(),
  ]);

  expect(
    ship.systems.sections.getHitSections(
      { x: 200, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      300
    )
  ).toEqual([
    ship.systems.sections.getFrontSection(),
    ship.systems.sections.getStarboardFrontSection(),
    ship.systems.sections.getStarboardAftSection(),
  ]);

  expect(
    ship.systems.sections.getHitSections(
      { x: -200, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      0
    )
  ).toEqual([
    ship.systems.sections.getAftSection(),
    ship.systems.sections.getPortAftSection(),
    ship.systems.sections.getStarboardAftSection(),
  ]);
});

test("Gets correct hit candidates", () => {
  const ship = new Ship({});
  ship.movement.isRolled = () => false;
  ship.getPosition = () => new Vector();
  ship.getFacing = () => 0;
  const primarySystems = [
    new Structure({ id: 1, hitpoints: 30, armor: 5 }),
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
  ];

  const frontSystems = [
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 12, 6),
  ];

  ship.systems.addPrimarySystem(primarySystems);
  ship.systems.addFrontSystem(frontSystems);

  const hitSystems = ship.systems.getSystemsForOuterHit(
    { x: 200, y: 0, z: 0 },
    null
  );

  expect(hitSystems.length).toBe(2);
  expect(systemsToNameIdString(hitSystems)).toEqual([
    "Structure id: '1'",
    "C/Fusion Hybrid Thruster id: '8'",
  ]);

  return ship;
});

test("Structure protects section behind", () => {
  const ship = new Ship({});
  ship.movement.isRolled = () => false;

  ship.getPosition = () => new Vector();
  ship.getFacing = () => 0;
  const primarySystems = [
    new Structure({ id: 1, hitpoints: 30, armor: 5 }),
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
  ];

  const frontSystems = [
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 12, 6),
    new Structure({ id: 9, hitpoints: 30, armor: 5 }),
  ];

  ship.systems.addPrimarySystem(primarySystems);
  ship.systems.addFrontSystem(frontSystems);

  const hitSystems = ship.systems.getSystemsForOuterHit(
    { x: 200, y: 0, z: 0 },
    null
  );
  expect(hitSystems.length).toBe(2);
  expect(hitSystems).toEqual(frontSystems);

  return ship;
});

test("Gets correct hit heading when ship is rolled", () => {
  const rolledShip = getShipWithStructures(true);
  const ship = getShipWithStructures(false);

  let rolledFacing = rolledShip.systems.sections.getHitSectionHeading(
    { x: 200, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    60
  );

  let normalFacing = ship.systems.sections.getHitSectionHeading(
    { x: 200, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    60
  );

  expect(normalFacing).toBe(300);
  expect(rolledFacing).toBe(60);
});

test("Gets correct sections when ship is rolled", () => {
  const ship = getShipWithStructures(true);

  expect(
    ship.systems.sections.getHitSections(
      { x: 200, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      300
    )
  ).toEqual([
    ship.systems.sections.getFrontSection(),
    ship.systems.sections.getPortFrontSection(),
    ship.systems.sections.getPortAftSection(),
  ]);
});
