import test from "ava";
import TorpedoHandler from "../../server/handler/TorpedoHandler.mjs";
import TorpedoFlight from "../../model/unit/TorpedoFlight.mjs";
import Vector from "../../model/utils/Vector.mjs";
import Ship from "../../model/unit/Ship.mjs";
import PDC30mm from "../../model/unit/system/weapon/pdc/PDC30mm.mjs";
import MovementOrder from "../../model/movement/MovementOrder.mjs";
import movementTypes from "../../model/movement/movementTypes.mjs";
import Offset from "../../model/hexagon/Offset.mjs";
import GameData from "../../model/game/GameData.mjs";
import Reactor from "../../model/unit/system/reactor/Reactor.mjs";
import Structure from "../../model/unit/system/structure/Structure.mjs";
import Torpedo158MSV from "../../model/unit/system/weapon/ammunition/torpedo/Torpedo158MSV.mjs";
import GameSlot from "../../model/game/GameSlot.mjs";
import User from "../../model/User.mjs";
import StandardHitStrategy from "../../model/unit/system/strategy/weapon/StandardHitStrategy.mjs";
import EwArray from "../../model/unit/system/electronicWarfare/EwArray.mjs";
import WeaponHitChance from "../../model/weapon/WeaponHitChance.mjs";
import TorpedoAttackService from "../../model/weapon/TorpedoAttackService.mjs";

const createShipAndTorpedo = () => {
  const ship = new Ship({ id: 1 });
  ship.frontHitProfile = 50;
  ship.sideHitProfile = 50;

  ship.systems.addPrimarySystem([
    new PDC30mm({ id: 14, hitpoints: 5, armor: 3 }, { start: 0, end: 0 }),
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 }),
    new EwArray({ id: 9, hitpoints: 20, armor: 5 }, 8)
  ]);

  ship.movement.addMovement(
    new MovementOrder(
      -1,
      movementTypes.DEPLOY,
      new Offset(0, 0),
      new Offset(0, 0),
      0,
      false,
      1,
      0,
      null,
      1
    )
  );

  ship.electronicWarfare.activatePlannedElectronicWarfare();

  const shooter = new Ship({ id: 2 });
  shooter.systems.addPrimarySystem([
    new Reactor({ id: 7, hitpoints: 10, armor: 3 }, 20),
    new Structure({ id: 8, hitpoints: 50, armor: 4 })
  ]);

  const torpedo = new TorpedoFlight(new Torpedo158MSV(), 1, 2, 3, 1);
  torpedo.setLaunchPosition(new Vector(1000, 0));
  torpedo.setStrikePosition(new Vector(500, 0));

  const gameData = new GameData();

  ship.player.setUser(new User(1, "testUser"));
  const slot = new GameSlot(
    {
      userId: 1
    },
    gameData
  );

  slot.addShip(ship);
  gameData.ships.addShip(ship);
  gameData.slots.addSlot(slot);

  shooter.player.setUser(new User(2, "testEnemy"));
  const slot2 = new GameSlot(
    {
      userId: 2
    },
    gameData
  );

  slot2.addShip(shooter);
  gameData.ships.addShip(shooter);
  gameData.slots.addSlot(slot2);

  gameData.torpedos.addTorpedoFlights(torpedo);

  return gameData;
};

test("Torpedo can be intercepted", test => {
  const gameData = createShipAndTorpedo();
  const handler = new TorpedoHandler();
  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];

  const interceptor = handler.chooseInterceptor(
    new TorpedoAttackService().update(gameData),
    gameData,
    torpedoFlight,
    [],
    1
  );

  test.is(interceptor.id, 14);
});

test("Torpedo can not be intercepted, if weapon is offline", test => {
  const gameData = createShipAndTorpedo();

  const pdc = gameData.ships.getShips()[0].systems.getSystemById(14);
  pdc.power.setOffline();

  const handler = new TorpedoHandler();
  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];

  const interceptor = handler.chooseInterceptor(
    new TorpedoAttackService().update(gameData),
    gameData,
    torpedoFlight,
    [],
    1
  );

  test.is(interceptor, undefined);
});

test("Torpedo can not be intercepted, if weapon is not on arc", test => {
  const gameData = createShipAndTorpedo();

  const ship = gameData.ships.getShips()[0];
  const pdc = ship.systems.getSystemById(14);
  pdc.power.setOffline();

  ship.systems.addPrimarySystem([
    new PDC30mm({ id: 15, hitpoints: 5, armor: 3 }, { start: 90, end: 270 })
  ]);

  const handler = new TorpedoHandler();
  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];

  const interceptor = handler.chooseInterceptor(
    new TorpedoAttackService().update(gameData),
    gameData,
    torpedoFlight,
    [],
    1
  );

  test.is(interceptor, undefined);
});

test("Torpedo can not be intercepted, if weapon is already used", test => {
  const gameData = createShipAndTorpedo();

  const ship = gameData.ships.getShips()[0];
  const pdc = ship.systems.getSystemById(14);

  const handler = new TorpedoHandler();
  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];

  const interceptor = handler.chooseInterceptor(
    new TorpedoAttackService().update(gameData),
    gameData,
    torpedoFlight,
    [pdc],
    1
  );

  test.is(interceptor, undefined);
});

test("Better interceptor is used first", test => {
  const gameData = createShipAndTorpedo();

  const ship = gameData.ships.getShips()[0];
  ship.systems.addPrimarySystem([
    new PDC30mm({ id: 15, hitpoints: 5, armor: 3 }, { start: 0, end: 0 })
  ]);

  const pdc = ship.systems.getSystemById(15);
  const pdc2 = ship.systems.getSystemById(14);

  pdc.strategies.find(
    strategy => strategy instanceof StandardHitStrategy
  ).fireControl = 50;

  const handler = new TorpedoHandler();
  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];

  const interceptor = handler.chooseInterceptor(
    new TorpedoAttackService().update(gameData),
    gameData,
    torpedoFlight,
    [],
    1
  );

  test.is(interceptor.id, 15);
});

test("Intercept hit change is calculated properly", test => {
  const gameData = createShipAndTorpedo();
  const ship = gameData.ships.getShips()[0];
  ship.electronicWarfare.assignCcEw(8);
  const pdc = ship.systems.getSystemById(14);

  ship.movement.isRolling = () => true;

  const torpedoFlight = gameData.torpedos.getTorpedoFlights()[0];
  const result = pdc.callHandler("getInterceptChance", {
    target: ship,
    torpedoFlight
  });

  test.deepEqual(
    result,
    new WeaponHitChance({
      absoluteResult: 34,
      baseToHit: 0,
      dew: 0,
      distance: 2,
      evasion: 30,
      fireControl: 30,
      oew: 8,
      outOfRange: false,
      rangeModifier: -16,
      rollingPenalty: -20,
      result: 34
    })
  );
});
