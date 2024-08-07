import test from "ava";
import HitSystemRandomizer from "../../model/unit/system/strategy/weapon/utils/HitSystemRandomizer.mjs";
import Structure from "../../model/unit/system/structure/Structure.mjs";
import { PDC30mm } from "../../model/unit/system/weapon/pdc/index.mjs";
import { RailgunTurreted32gw } from "../../model/unit/system/weapon/coilgun/index.mjs";
import Ship from "../../model/unit/Ship.mjs";
import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import Vector from "../../model/utils/Vector.mjs";
import Offset from "../../model/hexagon/Offset.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import movementTypes from "../../model/movement/movementTypes.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";

const constructShip = (id = 123) => {
  let ship = new Ship({
    id,
    accelcost: 3
  });
  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }),
    new Structure({ id: 300, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 })
  ]);

  return ship;
};

const constructNoStructureShip = (id = 123) => {
  let ship = new Ship({
    id,
    accelcost: 3
  });

  ship.systems.addFrontSystem([
    new PDC30mm({ id: 101, hitpoints: 5, armor: 3 })
  ]);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20)
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }),
    new Structure({ id: 300, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 })
  ]);

  return ship;
};

test("Returns systems available for hit with structures blocking", test => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  test.deepEqual(
    ship.systems
      .getSystemsForHit(shooter.getPosition())
      .map(system => system.id)
      .sort(),
    [400, 501, 500].sort()
  );
});

test("Returns systems available for hit ignoring destroyed structures", test => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  ship.systems.getSystemById(400).addDamage(new DamageEntry(100, 0));

  test.deepEqual(
    ship.systems
      .getSystemsForHit(shooter.getPosition())
      .map(system => system.id)
      .sort(),
    [501, 500, 300, 301].sort()
  );
});

test("Ignores section when looking for overkill system", test => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  test.deepEqual(
    ship.systems
      .getSystemsForHit(
        shooter.getPosition(),
        ship.systems.sections.getSectionBySystem(
          ship.systems.getSystemById(500)
        )
      )
      .map(system => system.id)
      .sort(),
    [6, 7, 8].sort()
  );
});

test("Ignores destroyed section when looking for overkill system", test => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const structure = ship.systems.getSystemById(500);
  structure.addDamage(new DamageEntry(500, 0, 0));

  test.deepEqual(
    ship.systems
      .getSystemsForHit(
        shooter.getPosition(),
        ship.systems.sections.getSectionBySystem(structure)
      )
      .map(system => system.id)
      .sort(),
    [6, 7, 8].sort()
  );
});

test("Penetrates whole ship if no structures intevene", test => {
  const ship = constructNoStructureShip();
  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      1,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const structure = ship.systems.getSystemById(400);

  test.deepEqual(
    ship.systems
      .getSystemsForHit(
        shooter.getPosition(),
        ship.systems.sections.getSectionBySystem(structure)
      )
      .map(system => system.id)
      .sort(),
    [6, 7, 101].sort()
  );
});

test("No penetrable section available", test => {
  const ship = new Ship({
    id: 999
  });

  ship.systems.addFrontSystem([
    new Structure({ id: 100, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }),
    new Structure({ id: 500, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }),
    new Structure({ id: 300, hitpoints: 50, armor: 4 })
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 4 })
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-3, 3),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const shooter = constructShip();
  shooter.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      0,
      1
    )
  );

  const structure = ship.systems.getSystemById(100);

  test.deepEqual(
    ship.systems
      .getSystemsForHit(
        shooter.getPosition(),
        ship.systems.sections.getSectionBySystem(structure)
      )
      .map(system => system.id),
    []
  );
});
