import test from "ava";
import ShipSystemSections from "../../model/unit/system/ShipSystemSections";
import Vector from "../../model/utils/Vector";

import Ship from "../../model/unit/Ship";
import Thruster from "../../model/unit/system/thruster/Thruster";
import Engine from "../../model/unit/system/engine/Engine";
import Reactor from "../../model/unit/system/reactor/Reactor";
import Structure from "../../model/unit/system/structure/Structure";
import MovementOrder from "../../model/movement/MovementOrder";
import movementTypes from "../../model/movement/movementTypes";
import Offset from "../../model/hexagon/Offset";

const getShipWithStructures = (rolled = false) => {
  const ship = new Ship({});
  ship.getPosition = () => new Vector();
  ship.getFacing = () => 0;

  const startMove = new MovementOrder(
    -1,
    movementTypes.START,
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
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Structure({ id: 2, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addAftSystem([
    new Thruster({ id: 58, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Structure({ id: 52, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addPortFrontSystem([
    new Thruster({ id: 18, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Structure({ id: 12, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addPortAftSystem([
    new Thruster({ id: 28, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Structure({ id: 22, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addStarboardFrontSystem([
    new Thruster({ id: 38, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Structure({ id: 32, hitpoints: 30, armor: 5 }),
  ]);
  ship.systems.addStarboardAftSystem([
    new Thruster({ id: 48, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Structure({ id: 42, hitpoints: 30, armor: 5 }),
  ]);

  return ship;
};

test("Gets correct heading", (test) => {
  const sections = new ShipSystemSections({
    movement: { isRolled: () => false },
  });

  test.is(
    sections.getHitSectionHeading({ x: 200, y: 0 }, { x: 0, y: 0 }, 0),
    0
  );
  test.is(
    sections.getHitSectionHeading({ x: 200, y: 0 }, { x: 0, y: 0 }, 270),
    90
  );
  test.is(
    sections.getHitSectionHeading({ x: 200, y: 0 }, { x: 0, y: 0 }, 180),
    180
  );
});

test("Gets correct sections", (test) => {
  const ship = getShipWithStructures();
  test.deepEqual(
    ship.systems.sections.getHitSections({ x: 200, y: 0 }, { x: 0, y: 0 }, 0),
    [
      ship.systems.sections.getFrontSection(),
      ship.systems.sections.getPortFrontSection(),
      ship.systems.sections.getStarboardFrontSection(),
    ]
  );

  test.deepEqual(
    ship.systems.sections.getHitSections({ x: 200, y: 0 }, { x: 0, y: 0 }, 300),
    [
      ship.systems.sections.getFrontSection(),
      ship.systems.sections.getStarboardFrontSection(),
      ship.systems.sections.getStarboardAftSection(),
    ]
  );

  test.deepEqual(
    ship.systems.sections.getHitSections({ x: -200, y: 0 }, { x: 0, y: 0 }, 0),
    [
      ship.systems.sections.getAftSection(),
      ship.systems.sections.getPortAftSection(),
      ship.systems.sections.getStarboardAftSection(),
    ]
  );
});

test("Gets correct hit candidates", (test) => {
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
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 12, 6, 2),
  ];

  ship.systems.addPrimarySystem(primarySystems);
  ship.systems.addFrontSystem(frontSystems);

  const hitSystems = ship.systems.getSystemsForHit({ x: 200, y: 0 });
  test.is(hitSystems.length, 4);
  test.deepEqual(hitSystems, [...primarySystems, ...frontSystems]);

  return ship;
});

test("Structure protects section behind", (test) => {
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
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Structure({ id: 9, hitpoints: 30, armor: 5 }),
  ];

  ship.systems.addPrimarySystem(primarySystems);
  ship.systems.addFrontSystem(frontSystems);

  const hitSystems = ship.systems.getSystemsForHit({ x: 200, y: 0 });
  test.is(hitSystems.length, 2);
  test.deepEqual(hitSystems, frontSystems);

  return ship;
});

test("Gets correct hit heading when ship is rolled", (test) => {
  const rolledShip = getShipWithStructures(true);
  const ship = getShipWithStructures(false);

  let rolledFacing = rolledShip.systems.sections.getHitSectionHeading(
    { x: 200, y: 0 },
    { x: 0, y: 0 },
    60
  );

  let normalFacing = ship.systems.sections.getHitSectionHeading(
    { x: 200, y: 0 },
    { x: 0, y: 0 },
    60
  );

  test.deepEqual(normalFacing, 300);
  test.deepEqual(rolledFacing, 60);
});

test("Gets correct sections when ship is rolled", (test) => {
  const ship = getShipWithStructures(true);

  test.deepEqual(
    ship.systems.sections.getHitSections({ x: 200, y: 0 }, { x: 0, y: 0 }, 300),
    [
      ship.systems.sections.getFrontSection(),
      ship.systems.sections.getPortFrontSection(),
      ship.systems.sections.getPortAftSection(),
    ]
  );
});
