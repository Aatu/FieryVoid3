import test from "ava";
import {
  StandardDamageStrategy,
  BurstDamageStrategy,
  PiercingDamageStrategy,
  ExplosiveDamageStrategy,
} from "../../model/unit/system/strategy/index.mjs";
import FireOrder from "../../model/weapon/FireOrder.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import HitSystemRandomizer from "../../model/unit/system/strategy/weapon/utils/HitSystemRandomizer.mjs";
import Structure from "../../model/unit/system/structure/Structure.mjs";
import { PDC30mm } from "../../model/unit/system/weapon/pdc/index.mjs";
import { RailgunTurreted32gw } from "../../model/unit/system/weapon/coilgun/index.mjs";
import Ship from "../../model/unit/Ship.mjs";
import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Vector from "../../model/utils/Vector.mjs";
import Offset from "../../model/hexagon/Offset.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import movementTypes from "../../model/movement/movementTypes.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import WeaponHitChance from "../../model/weapon/WeaponHitChance.mjs";
import CombatLogWeaponFire from "../../model/combatLog/CombatLogWeaponFire.mjs";
import CombatLogWeaponFireHitResult from "../../model/combatLog/CombatLogWeaponFireHitResult.mjs";
import HETorpedoDamageStrategy from "../../model/unit/system/weapon/ammunition/torpedo/torpedoDamageStrategy/HETorpedoDamageStrategy.mjs";
import TorpedoFlight from "../../model/unit/TorpedoFlight.mjs";
import Torpedo72HE from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo72HE.mjs";
import CombatLogTorpedoAttack from "../../model/combatLog/CombatLogTorpedoAttack.mjs";
import MSVTorpedoDamageStrategy from "../../model/unit/system/weapon/ammunition/torpedo/torpedoDamageStrategy/MSVTorpedoDamageStrategy.mjs";
import Torpedo158MSV from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo158MSV.mjs";

const constructShip = (id = 123) => {
  let ship = new Ship({
    id,
    accelcost: 3,
  });

  ship.systems.addFrontSystem([
    new Structure({ id: 100, hitpoints: 50, armor: 1 }),
  ]);

  ship.systems.addPrimarySystem([
    new Engine({ id: 6, hitpoints: 10, armor: 3 }, 12, 6, 2),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 1 }),
  ]);

  ship.systems.addPortAftSystem([
    new PDC30mm({ id: 501, hitpoints: 5, armor: 3 }),
    new Structure({ id: 500, hitpoints: 50, armor: 1 }),
  ]);

  ship.systems.addStarboardAftSystem([
    new PDC30mm({ id: 301, hitpoints: 5, armor: 3 }),
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

  ship.frontHitProfile = 400;
  ship.sideHitProfile = 400;

  const torpedo = new Torpedo158MSV();
  const flight = new TorpedoFlight(torpedo, ship.id, shooter.id, 1, 1);
  flight.setStrikePosition(new Offset(5, 7).toVector());
  const torpedoAttack = new CombatLogTorpedoAttack(flight.id, ship.id);

  torpedo.damageStrategy.strikeHitChance = 100;
  torpedo.damageStrategy.applyDamageFromWeaponFire({
    target: ship,
    shooter,
    torpedoFlight: flight,
    gameData: null,
    combatLogEvent: torpedoAttack,
  });

  const damagedSystems = ship.systems
    .getSystems()
    .filter((system) => system.damage.getPercentUnDamaged() < 1);

  test.true(damagedSystems.length > 0);
  test.deepEqual(torpedoAttack.notes, [
    "MSV with 32 projectiles at distance 10 with hit chance of 250% each.",
    "32 MSVs hit target.",
  ]);
});