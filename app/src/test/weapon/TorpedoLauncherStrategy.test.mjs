import test from "ava";
import {
  StandardDamageStrategy,
  BurstDamageStrategy,
  PiercingDamageStrategy,
  ExplosiveDamageStrategy
} from "../../model/unit/system/strategy/index.mjs";
import FireOrder from "../../model/weapon/FireOrder.mjs";
import FireOrderResult from "../../model/weapon/FireOrderResult.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import HitSystemRandomizer from "../../model/unit/system/strategy/weapon/utils/HitSystemRandomizer.mjs";
import Structure from "../../model/unit/system/structure/Structure.mjs";
import { PDC30mm } from "../../model/unit/system/weapon/pdc/index.mjs";
import { RailgunTurreted32gw } from "../../model/unit/system/weapon/railgun/index.mjs";
import Ship from "../../model/unit/Ship.mjs";
import Thruster from "../../model/unit/system/thruster/Thruster.mjs";
import Engine from "../../model/unit/system/engine/Engine.mjs";
import Vector from "../../model/utils/Vector.mjs";
import Offset from "../../model/hexagon/Offset.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import movementTypes from "../../model/movement/MovementTypes.mjs";
import DamageEntry from "../../model/unit/system/DamageEntry.mjs";
import FireOrderDamageResult from "../../model/weapon/FireOrderDamageResult.mjs";
import FireOrderDamageResultEntry from "../../model/weapon/FireOrderDamageResultEntry.mjs";
import FireOrderHitResult from "../../model/weapon/FireOrderHitResult.mjs";
import WeaponHitChange from "../../model/weapon/WeaponHitChange.mjs";
import TorpedoLauncherDual158 from "../../model/unit/system/weapon/launcher/TorpedoLauncherDual158.mjs";
import CargoBay from "../../model/unit/system/cargo/CargoBay.mjs";
import Torpedo158MSV from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo158MSV.mjs";
import Torpedo158Nuclear from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo158Nuclear.mjs";

const createShip = (data = { id: 1 }) => {
  const ship = new Ship(data);
  const torpedoLauncher = new TorpedoLauncherDual158({
    id: 2,
    hitpoints: 10,
    armor: 3
  });
  const cargoBay = new CargoBay({ id: 3, hitpoints: 20, armor: 4 }, 50);

  ship.systems.addPrimarySystem([torpedoLauncher, cargoBay]);

  cargoBay.callHandler("addCargo", {
    cargo: new Torpedo158MSV(),
    amount: 10
  });

  cargoBay.callHandler("addCargo", {
    cargo: new Torpedo158Nuclear(),
    amount: 2
  });

  return ship;
};

test("Torpedo launcher can change loaded torpedo", test => {
  const ship = createShip();
  const torpedoLauncher = ship.systems.getSystemById(2);
  const cargoBay = ship.systems.getSystemById(3);

  const serverShip = createShip(ship.serialize());

  test.is(torpedoLauncher.strategies[1].loadedTorpedo, null);

  test.true(
    cargoBay.callHandler("hasCargo", { cargo: new Torpedo158MSV(), amount: 10 })
  );

  torpedoLauncher.callHandler("loadAmmo", {
    ammo: new Torpedo158MSV(),
    launcherIndex: 1
  });

  test.true(
    cargoBay.callHandler("hasCargo", { cargo: new Torpedo158MSV(), amount: 9 })
  );
  test.false(
    cargoBay.callHandler("hasCargo", { cargo: new Torpedo158MSV(), amount: 10 })
  );

  serverShip.receivePlayerData(ship);
  const serverShipCargoBay = serverShip.systems.getSystemById(3);
  const serverTorpedoLauncher = serverShip.systems.getSystemById(2);

  test.true(
    serverShipCargoBay.callHandler("hasCargo", {
      cargo: new Torpedo158MSV(),
      amount: 9
    })
  );
  test.false(
    serverShipCargoBay.callHandler("hasCargo", {
      cargo: new Torpedo158MSV(),
      amount: 10
    })
  );

  test.true(
    serverTorpedoLauncher.strategies[1].loadedTorpedo instanceof Torpedo158MSV
  );
});
