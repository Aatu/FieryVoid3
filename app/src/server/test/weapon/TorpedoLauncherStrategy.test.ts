import { expect, test } from "vitest";

import Ship, { ShipBase } from "../../../model/src/unit/Ship";
import TorpedoLauncherDual158 from "../../../model/src/unit/system/weapon/launcher/TorpedoLauncherDual158";
import CargoBay from "../../../model/src/unit/system/cargo/CargoBay";
import Torpedo158MSV from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158MSV";
import { SYSTEM_HANDLERS } from "../../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import Torpedo158Nuclear from "../../../model/src/unit/system/weapon/ammunition/torpedo/Torpedo158Nuclear";
import TorpedoLauncherStrategy from "../../../model/src/unit/system/strategy/weapon/TorpedoLauncherStrategy";
import GameData from "../../../model/src/game/GameData";

const createShip = (data: any = { id: 1 }) => {
  const ship = new Ship(data as unknown as ShipBase);

  const torpedoLauncher = new TorpedoLauncherDual158({
    id: 2,
    hitpoints: 10,
    armor: 3,
  });
  const cargoBay = new CargoBay({ id: 3, hitpoints: 20, armor: 4 }, 50);

  ship.systems.addPrimarySystem([torpedoLauncher, cargoBay]);

  cargoBay.callHandler(
    SYSTEM_HANDLERS.addCargo,
    {
      object: new Torpedo158MSV(),
      amount: 10,
    },
    undefined
  );

  cargoBay.callHandler(
    SYSTEM_HANDLERS.addCargo,
    {
      object: new Torpedo158Nuclear(),
      amount: 2,
    },
    undefined
  );

  return ship;
};

test("Torpedo launcher can change loaded torpedo", () => {
  const ship = createShip();
  const torpedoLauncher = ship.systems.getSystemById(2);
  const cargoBay = ship.systems.getSystemById(3);

  const serverShip = createShip(ship.serialize());

  expect(
    (torpedoLauncher.strategies[1] as TorpedoLauncherStrategy).loadedTorpedo
  ).toBeNull();

  expect(
    cargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      {
        object: new Torpedo158MSV(),
        amount: 10,
      },
      false as boolean
    )
  ).toBe(true);

  torpedoLauncher.callHandler(
    SYSTEM_HANDLERS.loadAmmo,
    {
      ammo: new Torpedo158MSV(),
      launcherIndex: 1,
    },
    undefined
  );

  expect(
    cargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      { object: new Torpedo158MSV(), amount: 9 },
      false as boolean
    )
  ).toBe(true);

  expect(
    cargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      {
        object: new Torpedo158MSV(),
        amount: 10,
      },
      false as boolean
    )
  ).toBe(false);

  serverShip.receivePlayerData(ship, null as unknown as GameData, 1);
  const serverShipCargoBay = serverShip.systems.getSystemById(3);
  const serverTorpedoLauncher = serverShip.systems.getSystemById(2);

  expect(
    serverShipCargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      {
        object: new Torpedo158MSV(),
        amount: 9,
      },
      false as boolean
    )
  ).toBe(true);

  expect(
    serverShipCargoBay.callHandler(
      SYSTEM_HANDLERS.hasCargo,
      {
        object: new Torpedo158MSV(),
        amount: 10,
      },
      false as boolean
    )
  ).toBe(false);

  expect(
    (serverTorpedoLauncher.strategies[0] as TorpedoLauncherStrategy)
      .loadedTorpedo instanceof Torpedo158MSV
  ).toBe(true);
});
