import HexagonMath from "../../model/utils/HexagonMath.mjs";
import TorpedoMovementService from "../../model/movement/TorpedoMovementService.mjs";
import CombatLogTorpedoAttack from "../../model/combatLog/CombatLogTorpedoAttack.mjs";
import CombatLogTorpedoMove from "../../model/combatLog/CombatLogTorpedoMove.mjs";
import CombatLogTorpedoOutOfTime from "../../model/combatLog/CombatLogTorpedoOutOfTime.mjs";
import CombatLogTorpedoNotArmed from "../../model/combatLog/CombatLogTorpedoNotArmed.mjs";

class TorpedoHandler {
  constructor() {
    this.torpedoMovementService = new TorpedoMovementService();
  }

  advance(gameData) {
    this.moveTorpedos(gameData);
    this.interceptTorpedos(gameData);
    this.impactTorpedos(gameData);
  }

  chooseInterceptor(gameData, flight, usedWeapons, interceptTry) {
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
          ...ship.systems
            .getSystems()
            .filter(system => !system.isDisabled())
            .filter(system => system.callHandler("canIntercept"))
        ];
      }, [])
      .filter(weapon => {
        // only weapons that have arcs facing to the correct direction
        const torpedoPosition = flight.position;
        return weapon.callHandler(
          "isPositionOnArc",
          { targetPosition: torpedoPosition },
          true
        );
      })
      .filter(weapon => {
        //disregard weapons that have fire order with result. Those without a result did not fire;
        const fireOrders = weapon.callHandler("getFireOrders", null, []);

        return fireOrders.length === 0;
      })
      .filter(weapon => {
        //get weapons that still have uses
        const numberOfIntercepts = weapon.callHandler(
          "getNumberOfIntercepts",
          null,
          0
        );

        const used = usedWeapons.reduce(
          (total, usedWeapon) => (usedWeapon === weapon ? total + 1 : total),
          []
        );

        return numberOfIntercepts > used;
      })
      .sort((a, b) => {
        const changeA = a.callHandler(
          "getInterceptChance",
          { target, torpedoFlight: flight, interceptTry },
          0
        ).result;
        const changeB = b.callHandler(
          "getInterceptChance",
          { target, torpedoFlight: flight, interceptTry },
          0
        ).result;

        if (changeA > changeB) {
          return 1;
        }

        if (changeA < changeB) {
          return -1;
        }

        return 0;
      })
      .pop();

    return interceptor;
  }

  interceptTorpedos(gameData) {
    const impactingTorpedos = gameData.torpedos
      .getTorpedoFlights()
      .filter(flight => flight.reachedTarget);

    let interceptTry = 5;

    while (interceptTry--) {
      const usedWeapons = [];

      let interception = null;
      do {
        interception = impactingTorpedos
          .filter(flight => flight.getInterceptTries() >= interceptTry)
          .map(flight => {
            const target = gameData.ships.getShipById(flight.targetId);

            const weapon = this.chooseInterceptor(
              gameData,
              flight,
              usedWeapons,
              interceptTry
            );

            if (!weapon) {
              return;
            }

            return {
              torpedoFlight,
              interceptor: weapon,
              interceptChange: weapon
                ? weapon.callHandler(
                    "getInterceptChance",
                    { target, torpedoFlight: torpedoFlight, interceptTry },
                    0
                  )
                : 0
            };
          })
          .filter(
            interceptDetails => interceptDetails.interceptChange.result > 0
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
          usedWeapons.push(interception.weapon);
          const roll = Math.ceil(Math.random() * 100);

          if (roll <= interception.interceptChange.result) {
            torpedoFlight.setIntercepted(weapon, interceptChange);
          }
        }
      } while (interception);
    }
  }

  impactTorpedos(gameData) {
    gameData.torpedos
      .getTorpedoFlights()
      .filter(flight => flight.reachedTarget)
      .forEach(flight => {
        const target = gameData.ships.getShipById(flight.targetId);
        const shooter = gameData.ships.getShipById(flight.shooterId);

        const torpedoAttack = new CombatLogTorpedoAttack(flight.id);
        gameData.combatLog.addEntry(torpedoAttack);

        torpedoAttack.addNote(
          `Relative velocity ${
            flight.effectiveImpactVelocity
          } h/t (${Math.round(flight.strikeEffectivenes * 100)}% optimal)`
        );

        flight.torpedo.damageStrategy.applyDamageFromWeaponFire({
          target,
          shooter,
          torpedoFlight: flight,
          gameData,
          combatLogEvent: torpedoAttack
        });
      });
  }

  moveTorpedos(gameData) {
    gameData.torpedos.getTorpedoFlights().forEach(flight => {
      const target = gameData.ships.getShipById(flight.targetId);

      flight.turnsActive++;

      if (flight.noLongerActive()) {
        gameData.combatLog.addEntry(new CombatLogTorpedoOutOfTime(flight.id));
        return;
      }

      const {
        impactTurn,
        effectiveness,
        effectiveImpactVelocity,
        ...rest
      } = this.torpedoMovementService.predictTorpedoHitPositionAndTurn(
        flight,
        target
      );

      console.log(impactTurn, effectiveness, effectiveImpactVelocity, rest);

      if (impactTurn < 1) {
        if (!flight.hasArmed()) {
          gameData.combatLog.addEntry(
            new CombatLogTorpedoNotArmed(
              flight.id,
              flight.turnsActive,
              flight.torpedo.armingTime
            )
          );
          return;
        } else {
          flight.setReachedTarget(effectiveness, effectiveImpactVelocity);
          return;
        }
      }

      const startPosition = flight.position.clone();
      this.torpedoMovementService.moveTorpedo(flight, target);
      gameData.combatLog.addEntry(
        new CombatLogTorpedoMove(flight.id, startPosition, flight.position)
      );
    });
  }
}

export default TorpedoHandler;