import { expect, test } from "vitest";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import {
  MOVEMENT_TYPE,
  MovementService,
  RequiredThrust,
} from "../../../model/src/movement";
import Offset from "../../../model/src/hexagon/Offset";
import GameData from "../../../model/src/game/GameData";
import Ship from "../../../model/src/unit/Ship";
import FuelTank from "../../../model/src/unit/system/cargo/FuelTank";
import DamageEntry from "../../../model/src/unit/system/DamageEntry";
import { Engine } from "../../../model/src/unit/system/engine";
import { Reactor } from "../../../model/src/unit/system/reactor";
import {
  Thruster,
  ManeuveringThrusterLeft,
  ManeuveringThrusterRight,
} from "../../../model/src/unit/system/thruster";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";

const startMove = new MovementOrder(
  "-1",
  MOVEMENT_TYPE.START,
  new Offset(-32, 5),
  new Offset(3, 2),
  0,
  false,
  999,
  0,
  null,
  1
);

const deployMove = new MovementOrder(
  "-1",
  MOVEMENT_TYPE.DEPLOY,
  new Offset(0, 0),
  startMove.velocity,
  startMove.facing,
  startMove.rolled,
  999,
  0,
  null,
  2
);

const getMovementService = () =>
  new MovementService().update({ turn: 999 } as unknown as GameData, {
    relayEvent: () => null,
  });

const constructShip = (id: string = "shippolyytta") => {
  let ship = new Ship({
    id,
  });

  ship.accelcost = 3;
  ship.rollcost = 3;
  ship.pivotcost = 3;
  ship.evasioncost = 3;

  ship.systems.addPrimarySystem([
    new Thruster({ id: 1, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 2, hitpoints: 10, armor: 3 }, 5, 0),
    new Thruster({ id: 8, hitpoints: 10, armor: 3 }, 5, [1, 2]),
    new Thruster({ id: 9, hitpoints: 10, armor: 3 }, 5, [4, 5]),
    new Thruster({ id: 3, hitpoints: 10, armor: 3 }, 5, 3),
    new Thruster({ id: 4, hitpoints: 10, armor: 3 }, 5, 3, {
      boostPower: 1,
      maxBoost: 10,
    }),
    new ManeuveringThrusterLeft({ id: 10, hitpoints: 10, armor: 3 }, 9, 3),
    new ManeuveringThrusterRight({ id: 11, hitpoints: 10, armor: 3 }, 9, 3),
    new Engine({ id: 5, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new FuelTank({ id: 12, hitpoints: 10, armor: 3 }, 400),
  ]);

  ship.systems
    .getSystemById(12)
    .callHandler(SYSTEM_HANDLERS.setMaxFuel, undefined, undefined);
  ship.movement.addMovement(startMove);
  return ship;
};

const constructDeployedShip = (id?: string) => {
  const ship = constructShip(id);
  ship.movement.addMovement(deployMove);
  return ship;
};

const compareMovements = (moves1: MovementOrder[], moves2: MovementOrder[]) => {
  expect(
    moves1.map((move) =>
      move.clone().setRequiredThrust(null as unknown as RequiredThrust)
    )
  ).toEqual(
    moves2.map((move) =>
      move.clone().setRequiredThrust(null as unknown as RequiredThrust)
    )
  );
};

test("Ship can be deployed", (test) => {
  const movementService = getMovementService();
  const ship = constructShip();

  const pos = new Offset(10, 40);

  movementService.deploy(ship, pos);
  expect(ship.movement.getMovement()).toEqual([
    startMove,
    new MovementOrder(
      null,
      MOVEMENT_TYPE.DEPLOY,
      pos,
      startMove.velocity,
      startMove.facing,
      startMove.rolled,
      999,
      0,
      null,
      2
    ),
  ]);

  const pos2 = new Offset(2, 3);
  movementService.deploy(ship, pos2);
  expect(ship.movement.getMovement()).toEqual([
    startMove,
    new MovementOrder(
      null,
      MOVEMENT_TYPE.DEPLOY,
      pos2,
      startMove.velocity,
      startMove.facing,
      startMove.rolled,
      999,
      0,
      null,
      2
    ),
  ]);
});

test("Ship can thrust", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  expect(movementService.canThrust(ship, 0)).toBe(true);
  expect(movementService.canThrust(ship, 1)).toBe(true);
  expect(movementService.canThrust(ship, 2)).toBe(true);
  expect(movementService.canThrust(ship, 3)).toBe(true);
  expect(movementService.canThrust(ship, 4)).toBe(true);
  expect(movementService.canThrust(ship, 5)).toBe(true);
});

test("Ship can not thrust with destroyed thruster", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  ship.systems.getSystemById(9).addDamage(new DamageEntry(50));

  expect(ship.movement.getThrusters().length).toBe(7);
  expect(ship.movement.getMovement().length).toBe(2);

  expect(movementService.canThrust(ship, 0)).toBe(true);

  expect(movementService.canThrust(ship, 1)).toBe(false);
  expect(movementService.canThrust(ship, 2)).toBe(false);
  expect(ship.movement.getThrusters().length).toBe(7);
  expect(ship.movement.getMovement().length).toBe(2);
  expect(movementService.canThrust(ship, 3)).toBe(true);
  expect(movementService.canThrust(ship, 4)).toBe(true);
  expect(movementService.canThrust(ship, 5)).toBe(true);
});

test("Ship will thrust", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.thrust(ship, 3);
  movementService.thrust(ship, 3);
  compareMovements(ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      MOVEMENT_TYPE.SPEED,
      deployMove.position,
      deployMove.getHexVelocity().add(new Offset(-1, 0)),
      deployMove.facing,
      deployMove.rolled,
      999,
      3
    ).setIndex(3),
    new MovementOrder(
      null,
      MOVEMENT_TYPE.SPEED,
      deployMove.position,
      deployMove.getHexVelocity().add(new Offset(-2, 0)),
      deployMove.facing,
      deployMove.rolled,
      999,
      3
    ).setIndex(4),
  ]);
});

test("Ship can not thrust unlimited amount", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.thrust(ship, 1);

  expect(() => movementService.thrust(ship, 1)).toThrowError(
    "Tried to commit move that was not legal. Check legality first!"
  );
});

test("Opposite thrusts will cancel each other out", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.thrust(ship, 3);
  movementService.thrust(ship, 0);
  compareMovements(ship.movement.getMovement(), [startMove, deployMove]);
});

test("Ship can pivot", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  expect(movementService.canPivot(ship, -1)).toBe(true);
  expect(movementService.canPivot(ship, 1)).toBe(true);
});

test("Ship will pivot", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.pivot(ship, 1);
  compareMovements(ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      MOVEMENT_TYPE.PIVOT,
      deployMove.position,
      deployMove.velocity,
      1,
      deployMove.rolled,
      999,
      1
    ).setIndex(3),
  ]);
});

test("Two consecutive opposite pivots will cancel each other", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.pivot(ship, 1);
  movementService.pivot(ship, -1);
  compareMovements(ship.movement.getMovement(), [startMove, deployMove]);
});

test("Pivots with something in between will not cancel", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.pivot(ship, 1);
  movementService.thrust(ship, 2);
  movementService.pivot(ship, -1);
  compareMovements(ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      MOVEMENT_TYPE.PIVOT,
      deployMove.position,
      deployMove.velocity,
      1,
      deployMove.rolled,
      999,
      1
    ).setIndex(3),
    new MovementOrder(
      null,
      MOVEMENT_TYPE.SPEED,
      deployMove.position,
      deployMove.getHexVelocity().add(new Offset(0, -1)),
      1,
      deployMove.rolled,
      999,
      2
    ).setIndex(4),
    new MovementOrder(
      null,
      MOVEMENT_TYPE.PIVOT,
      deployMove.position,
      deployMove.getHexVelocity().add(new Offset(0, -1)),
      0,
      deployMove.rolled,
      999,
      -1
    ).setIndex(5),
  ]);
});

test("Ship can roll", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  expect(movementService.canRoll(ship)).toBe(true);
});

test("Ship will roll", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.roll(ship);
  compareMovements(ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      MOVEMENT_TYPE.ROLL,
      deployMove.position,
      deployMove.velocity,
      deployMove.facing,
      deployMove.rolled,
      999,
      true
    ).setIndex(3),
  ]);
});

test("Ship rolling twice does cancels each other out", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.roll(ship);
  movementService.roll(ship);
  compareMovements(ship.movement.getMovement(), [startMove, deployMove]);
});

test("Ship can evade", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  expect(movementService.canEvade(ship, 1)).toBe(true);
});

test("Ship will evade", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  compareMovements(ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      MOVEMENT_TYPE.EVADE,
      deployMove.position,
      deployMove.velocity,
      deployMove.facing,
      deployMove.rolled,
      999,
      2
    ).setIndex(3),
  ]);
});

test("Evasion is limited by ship capabilities", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  expect(movementService.canEvade(ship, 1)).toBe(false);

  compareMovements(ship.movement.getMovement(), [
    startMove,
    deployMove,
    new MovementOrder(
      null,
      MOVEMENT_TYPE.EVADE,
      deployMove.position,
      deployMove.velocity,
      deployMove.facing,
      deployMove.rolled,
      999,
      6
    ).setIndex(3),
  ]);
});

test("Can not evade negative amount", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();
  expect(movementService.canEvade(ship, -1)).toBe(false);
});

test("Evasion cancels itself", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.evade(ship, 1);
  movementService.evade(ship, 1);
  movementService.evade(ship, -1);
  movementService.evade(ship, -1);

  compareMovements(ship.movement.getMovement(), [startMove, deployMove]);
});

test("Get an end move", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  movementService.roll(ship);
  movementService.evade(ship, 1);
  movementService.pivot(ship, 1);
  movementService.thrust(ship, 1);
  const endMove = movementService.getNewEndMove(ship);

  compareMovements(
    [endMove.round()],
    [
      new MovementOrder(
        null,
        MOVEMENT_TYPE.END,
        new Offset(4, 1),
        new Offset(4, 1),
        1,
        false,
        1000,
        0,
        undefined,
        0,
        1
      ).round(),
    ]
  );
});

test("Boosted movements get deleted when thruster deboosts", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();
  ship.systems.getSystemById(5).addDamage(new DamageEntry(50));
  const thruster = ship.systems.getSystemById(4);

  movementService.thrust(ship, 0);
  movementService.thrust(ship, 0);
  movementService.thrust(ship, 0);
  expect(movementService.canThrust(ship, 0)).toBe(false);

  thruster.handlers.boost();
  thruster.handlers.boost();
  thruster.handlers.boost();

  expect(movementService.canThrust(ship, 0)).toBe(true);
  expect(ship.movement.getMovement().length).toBe(5);

  movementService.thrust(ship, 0);

  thruster.handlers.deBoost();
  expect(ship.movement.getMovement().length).toBe(5);
  expect(movementService.canThrust(ship, 0)).toBe(false);
});

test("Ship can not pivot, if relevant thruster is destroyed", (test) => {
  const movementService = getMovementService();
  const ship = constructDeployedShip();

  ship.systems.getSystemById(11).addDamage(new DamageEntry(50));

  expect(movementService.canPivot(ship, 1)).toBe(true);
  expect(movementService.canPivot(ship, -1)).toBe(false);

  ship.systems.getSystemById(10).addDamage(new DamageEntry(50));
  expect(movementService.canPivot(ship, 1)).toBe(false);
});
