import CombatLogTorpedoAttack from "../../model/src/combatLog/CombatLogTorpedoAttack";
import CombatLogTorpedoIntercept from "../../model/src/combatLog/CombatLogTorpedoIntercept";
import GameData from "../../model/src/game/GameData";
import ShipSystem from "../../model/src/unit/system/ShipSystem";
import { SYSTEM_HANDLERS } from "../../model/src/unit/system/strategy/types/SystemHandlersTypes";
import Weapon from "../../model/src/unit/system/weapon/Weapon";
import TorpedoFlight from "../../model/src/unit/TorpedoFlight";
import TorpedoAttackService from "../../model/src/weapon/TorpedoAttackService";
import WeaponHitChance from "../../model/src/weapon/WeaponHitChance";

class TorpedoHandler {
  constructor() {}

  advance(gameData: GameData) {
    this.interceptTorpedos(gameData);
    this.impactTorpedos(gameData);
  }

  chooseInterceptor(
    torpedoAttackService: TorpedoAttackService,
    gameData: GameData,
    flight: TorpedoFlight,
    usedWeapons: Weapon[]
  ) {
    const target = gameData.ships.getShipById(flight.targetId);
    const interceptor = gameData.ships
      .getShips()
      .filter(
        (ship) =>
          gameData.slots.getTeamForShip(ship) ===
          gameData.slots.getTeamForShip(target)
      )
      .reduce((all, ship) => {
        //get weapons capable of intercepting
        return [
          ...all,
          ...torpedoAttackService.getPossibleInterceptors(ship, flight),
        ];
      }, [] as ShipSystem[])
      .filter((weapon) => {
        //get weapons that still have uses
        const numberOfIntercepts = weapon.callHandler(
          SYSTEM_HANDLERS.getNumberOfIntercepts,
          null,
          0 as number
        );

        const used = usedWeapons.reduce(
          (total, usedWeapon) => (usedWeapon === weapon ? total + 1 : total),
          0
        );

        return numberOfIntercepts > used;
      })
      .filter((weapon) => weapon.heat.getOverheatPercentage() < 1)
      .sort((a, b) => {
        const changeA = a.callHandler(
          SYSTEM_HANDLERS.getInterceptChance,
          { target, torpedoFlight: flight },
          {} as unknown as WeaponHitChance
        ).result;
        const changeB = b.callHandler(
          SYSTEM_HANDLERS.getInterceptChance,
          { target, torpedoFlight: flight },
          {} as unknown as WeaponHitChance
        ).result;

        if (changeA > changeB) {
          return 1;
        }

        if (changeA < changeB) {
          return -1;
        }

        const { overheatPercentage: aHeat, coolingPercent: aCooling } =
          a.heat.predictHeatChange();
        const { overheatPercentage: bHeat, coolingPercent: bCooling } =
          b.heat.predictHeatChange();

        if (aHeat > bHeat) {
          return -1;
        }

        if (aHeat < bHeat) {
          return 1;
        }

        if (aCooling > bCooling) {
          return -1;
        }

        if (aCooling < bCooling) {
          return 1;
        }

        return 0;
      })
      .pop();

    return interceptor;
  }

  interceptTorpedos(gameData: GameData) {
    const torpedoAttackService = new TorpedoAttackService().update(gameData);
    const impactingTorpedos = gameData.torpedos.getTorpedoFlights();

    const usedWeapons: Weapon[] = [];

    let interception = null;
    do {
      interception = (
        impactingTorpedos
          .filter((flight) => !flight.intercepted)
          .map((flight) => {
            const target = gameData.ships.getShipById(flight.targetId);

            const weapon = this.chooseInterceptor(
              torpedoAttackService,
              gameData,
              flight,
              usedWeapons
            );

            if (!weapon) {
              return null;
            }

            return {
              torpedoFlight: flight,
              interceptor: weapon,
              interceptChange: weapon.callHandler(
                SYSTEM_HANDLERS.getInterceptChance,
                { target, torpedoFlight: flight },
                {} as unknown as WeaponHitChance
              ),
            };
          })
          .filter(Boolean) as InterceptDetails[]
      )
        .filter(
          (interceptDetails) => interceptDetails?.interceptChange?.result > 0
        )
        .sort((a, b) => {
          const changeA = a.interceptChange.result;
          const changeB = b.interceptChange.result;

          if (changeA > changeB) {
            return 1;
          }

          if (changeA < changeB) {
            return -1;
          }

          return 0;
        })
        .pop();

      if (interception) {
        const weapon = interception.interceptor;
        usedWeapons.push(weapon);

        const roll = Math.ceil(Math.random() * 100);

        const logEntry = new CombatLogTorpedoIntercept(
          interception.torpedoFlight.id,
          weapon.getShipSystems().ship.id,
          weapon.id,
          interception.interceptChange,
          roll
        );

        if (roll <= interception.interceptChange.result) {
          interception.torpedoFlight.setIntercepted();

          weapon.log
            .getGenericLogEntry()
            .addMessage(
              `Intercepted ${interception.torpedoFlight.torpedo.getDisplayName()}.`
            );
        } else {
          weapon.log
            .getGenericLogEntry()
            .addMessage(
              `Failed to intercept ${interception.torpedoFlight.torpedo.getDisplayName()}.`
            );
        }

        weapon.callHandler(SYSTEM_HANDLERS.addTimesIntercepted, 1, undefined);
        weapon.callHandler(SYSTEM_HANDLERS.onIntercept, undefined, undefined);

        gameData.combatLog.addEntry(logEntry);
      }
    } while (interception);
  }

  impactTorpedos(gameData: GameData) {
    gameData.torpedos.getTorpedoFlights().forEach((flight) => {
      const target = gameData.ships.getShipById(flight.targetId);
      const shooter = gameData.ships.getShipById(flight.shooterId);

      const torpedoAttack = new CombatLogTorpedoAttack(flight.id, target.id);
      gameData.combatLog.addEntry(torpedoAttack);

      if (flight.intercepted) {
        torpedoAttack.addNote(`Torpedo intercepted`);
        flight.setDone();
        return;
      }

      flight.torpedo.getDamageStrategy().applyDamageFromWeaponFire({
        target,
        shooter,
        torpedoFlight: flight,
        combatLogEntry: torpedoAttack,
      });

      flight.setDone();
    });
  }
}

type InterceptDetails = {
  torpedoFlight: TorpedoFlight;
  interceptor: Weapon;
  interceptChange: WeaponHitChance;
};

export default TorpedoHandler;
