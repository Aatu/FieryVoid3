import HexagonMath from "../../model/utils/HexagonMath.mjs";
import TorpedoMovementService from "../../model/movement/TorpedoMovementService.mjs";
import CombatLogTorpedoAttack from "../../model/combatLog/CombatLogTorpedoAttack.mjs";
import CombatLogTorpedoMove from "../../model/combatLog/CombatLogTorpedoMove.mjs";
import CombatLogTorpedoOutOfTime from "../../model/combatLog/CombatLogTorpedoOutOfTime.mjs";
import CombatLogTorpedoNotArmed from "../../model/combatLog/CombatLogTorpedoNotArmed.mjs";
import coordinateConverter from "../../model/utils/CoordinateConverter.mjs";
import CombatLogTorpedoIntercept from "../../model/combatLog/CombatLogTorpedoIntercept.mjs";
import TorpedoAttackService from "../../model/weapon/TorpedoAttackService.mjs";

class TorpedoHandler {
  constructor() {}

  advance(gameData) {
    this.interceptTorpedos(gameData);
    this.impactTorpedos(gameData);
  }

  chooseInterceptor(torpedoAttackService, gameData, flight, usedWeapons) {
    const target = gameData.ships.getShipById(flight.targetId);
    const interceptor = gameData.ships
      .getShips()
      .filter(
        ship =>
          gameData.slots.getTeamForShip(ship) ===
          gameData.slots.getTeamForShip(target)
      )
      .reduce((all, ship) => {
        //get weapons capable of intercepting
        return [
          ...all,
          ...torpedoAttackService.getPossibleInterceptors(ship, flight)
        ];
      }, [])
      .filter(weapon => {
        //get weapons that still have uses
        const numberOfIntercepts = weapon.callHandler(
          "getNumberOfIntercepts",
          null,
          0
        );

        const used = usedWeapons.reduce(
          (total, usedWeapon) => (usedWeapon === weapon ? total + 1 : total),
          0
        );

        return numberOfIntercepts > used;
      })
      .filter(weapon => weapon.heat.getOverheatPercentage() < 1)
      .sort((a, b) => {
        const changeA = a.callHandler(
          "getInterceptChance",
          { target, torpedoFlight: flight },
          0
        ).result;
        const changeB = b.callHandler(
          "getInterceptChance",
          { target, torpedoFlight: flight },
          0
        ).result;

        if (changeA > changeB) {
          return 1;
        }

        if (changeA < changeB) {
          return -1;
        }

        const aHeat = a.heat.getOverheatPercentage(
          a.callHandler("getInterceptHeat", null, 0)
        );
        const bHeat = b.heat.getOverheatPercentage(
          b.callHandler("getInterceptHeat", null, 0)
        );

        if (aHeat < bHeat) {
          return 1;
        }

        if (aHeat > bHeat) {
          return -1;
        }

        return 0;
      })
      .pop();

    return interceptor;
  }

  interceptTorpedos(gameData) {
    const torpedoAttackService = new TorpedoAttackService().update(gameData);
    const impactingTorpedos = gameData.torpedos.getTorpedoFlights();

    const usedWeapons = [];

    let interception = null;
    do {
      interception = impactingTorpedos
        .filter(flight => !flight.intercepted)
        .map(flight => {
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
              "getInterceptChance",
              { target, torpedoFlight: flight },
              0
            )
          };
        })
        .filter(Boolean)
        .filter(interceptDetails => interceptDetails.interceptChange.result > 0)
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
          weapon.shipSystems.ship.id,
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

        weapon.callHandler("addTimesIntercepted", 1);
        weapon.callHandler("onIntercept");

        gameData.combatLog.addEntry(logEntry);
      }
    } while (interception);
  }

  impactTorpedos(gameData) {
    gameData.torpedos.getTorpedoFlights().forEach(flight => {
      const target = gameData.ships.getShipById(flight.targetId);
      const shooter = gameData.ships.getShipById(flight.shooterId);

      const torpedoAttack = new CombatLogTorpedoAttack(flight.id, target.id);
      gameData.combatLog.addEntry(torpedoAttack);

      if (flight.intercepted) {
        torpedoAttack.addNote(`Torpedo intercepted`);
        return;
      }

      flight.torpedo.damageStrategy.applyDamageFromWeaponFire({
        target,
        shooter,
        torpedoFlight: flight,
        gameData,
        combatLogEvent: torpedoAttack
      });
    });

    gameData.torpedos.removeTorpedos();
  }
}

export default TorpedoHandler;
