import test from "ava";
import Ship from "../../model/unit/Ship.mjs";
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
    object: new Torpedo158MSV(),
    amount: 10
  });

  cargoBay.callHandler("addCargo", {
    object: new Torpedo158Nuclear(),
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
    cargoBay.callHandler("hasCargo", {
      object: new Torpedo158MSV(),
      amount: 10
    })
  );

  torpedoLauncher.callHandler("loadAmmo", {
    ammo: new Torpedo158MSV(),
    launcherIndex: 1
  });

  test.true(
    cargoBay.callHandler("hasCargo", { object: new Torpedo158MSV(), amount: 9 })
  );
  test.false(
    cargoBay.callHandler("hasCargo", {
      object: new Torpedo158MSV(),
      amount: 10
    })
  );

  serverShip.receivePlayerData(ship);
  const serverShipCargoBay = serverShip.systems.getSystemById(3);
  const serverTorpedoLauncher = serverShip.systems.getSystemById(2);

  test.true(
    serverShipCargoBay.callHandler("hasCargo", {
      object: new Torpedo158MSV(),
      amount: 9
    })
  );
  test.false(
    serverShipCargoBay.callHandler("hasCargo", {
      object: new Torpedo158MSV(),
      amount: 10
    })
  );

  test.true(
    serverTorpedoLauncher.strategies[1].loadedTorpedo instanceof Torpedo158MSV
  );
});
