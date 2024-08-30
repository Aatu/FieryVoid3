import { expect, test } from "vitest";
import Ship, { ShipBase } from "../../../model/src/unit/Ship";
import Structure from "../../../model/src/unit/system/structure/Structure";
import Engine from "../../../model/src/unit/system/engine/Engine";
import Reactor from "../../../model/src/unit/system/reactor/Reactor";
import PDC30mm from "../../../model/src/unit/system/weapon/pdc/PDC30mm";
import MovementOrder from "../../../model/src/movement/MovementOrder";
import { MOVEMENT_TYPE } from "../../../model/src/movement";
import Offset from "../../../model/src/hexagon/Offset";
import Torpedo158MSV from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158MSV";
import TorpedoFlight from "../../../model/src/unit/TorpedoFlight";
import CombatLogTorpedoAttack from "../../../model/src/combatLog/CombatLogTorpedoAttack";
import GameData from "../../../model/src/game/GameData";

const constructShip = (id = 123) => {
  let ship = new Ship({
    id,
    accelcost: 3,
  } as unknown as ShipBase);

  ship.systems.addFrontSystem([
    new Structure({ id: 100, hitpoints: 50, armor: 1 }),
  ]);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 1 }),
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }, [{ start: 0, end: 360 }]),
    new Structure({ id: 500, hitpoints: 50, armor: 1 }),
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }, [{ start: 0, end: 360 }]),
    new Structure({ id: 300, hitpoints: 50, armor: 1 }),
  ]);

  ship.systems.addAftSystem([
    new Structure({ id: 400, hitpoints: 50, armor: 1 }),
  ]);

  return ship;
};

test("Torpedo MSV damage strategy causes damage", (test) => {
  const ship = constructShip();
  ship.movement.addMovement(
    new MovementOrder(
      "-1",
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
      "-1",
      MOVEMENT_TYPE.END,
      new Offset(-5, 7),
      new Offset(0, 0),
      0,
      false,
      1
    )
  );

  ship.frontHitProfile = 400;
  ship.sideHitProfile = 400;

  const torpedo = new Torpedo158MSV();
  const flight = new TorpedoFlight(torpedo, ship.id, shooter.id, 1, 1);
  flight.setStrikePosition(new Offset(5, 7).toVector());
  const torpedoAttack = new CombatLogTorpedoAttack(flight.id, ship.id);

  (torpedo.getDamageStrategy() as any).strikeHitChance = 100;
  torpedo.getDamageStrategy().applyDamageFromWeaponFire({
    target: ship,
    torpedoFlight: flight,
    combatLogEntry: torpedoAttack,
  });

  const damagedSystems = ship.systems
    .getSystems()
    .filter((system) => system.damage.getPercentUnDamaged() < 1);

  expect(damagedSystems.length > 0).toBe(true);
  expect(torpedoAttack.notes).toEqual([
    "MSV with 32 projectiles at distance 10 with hit chance of 250% each.",
    "32 MSVs hit target.",
  ]);
});
