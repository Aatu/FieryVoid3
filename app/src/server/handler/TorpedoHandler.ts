import GameData from "../../model/src/game/GameData";
import Ship from "../../model/src/unit/Ship";
import Weapon from "../../model/src/unit/system/weapon/Weapon";
import { TorpedoFlightForIntercept } from "../../model/src/unit/TorpedoFlightForIntercept";
import {
  InterceptionEntry,
  InterceptorCandidate,
} from "../../model/src/unit/InterceptorCandidate";
import CombatLogTorpedoIntercept from "../../model/src/combatLog/CombatLogTorpedoIntercept";
import CombatLogTorpedoAttack from "../../model/src/combatLog/CombatLogTorpedoAttack";

export class TorpedoHandler {
  private gameData: GameData | null = null;
  private torpedoFlights: TorpedoFlightForIntercept[] = [];

  getGameData() {
    if (!this.gameData) {
      throw new Error("No game data");
    }
    return this.gameData;
  }

  advance(gameData: GameData) {
    this.gameData = gameData;
    this.torpedoFlights = gameData.torpedos
      .getTorpedoFlights()
      .map(
        (flight) =>
          new TorpedoFlightForIntercept(
            flight,
            gameData.ships.getShipById(flight.targetId)
          )
      )
      .sort(sortByPriority);

    let iterations = 0;
    while (
      this.torpedoFlights.some(
        (flight) => !flight.isDone() && !flight.isIntercepted()
      ) &&
      iterations < 20
    ) {
      iterations++;

      this.torpedoFlights = this.torpedoFlights.filter((flight) => {
        flight.advance();

        if (
          flight.isStricking(
            this.getGameData().ships.getShipById(flight.targetId)
          )
        ) {
          this.executeTorpedoStrike(flight);
          return false;
        }

        return true;
      });

      const candidates = getInterceptorCandidates(
        this.torpedoFlights,
        this.getGameData()
      );

      while (
        this.torpedoFlights.every(
          (flight) =>
            !flight.getHasNoInterceptionCandidates() &&
            !flight.isFullyIntercepted()
        )
      ) {
        this.torpedoFlights.forEach((flight) => {
          const candidate = candidates
            .filter(
              (candidate) =>
                candidate.wantToIntercept(flight) &&
                flight
                  .getInterceptors()
                  .every(
                    (entry) =>
                      entry.candidate.getInterceptor().id !==
                      candidate.getInterceptor().id
                  )
            )
            .map((candidate) => candidate.getEntry(flight))
            .sort(sortInterceptCandidates)
            .pop();

          if (candidate) {
            flight.addInterceptor(candidate);
          } else {
            flight.setNoInterceptionCandidates();
          }
        });
      }

      this.executeInterceptions();
    }
  }

  private executeInterceptions() {
    this.torpedoFlights.forEach((flight) => {
      const entries = flight.getInterceptors();

      const target = this.getGameData().ships.getShipById(flight.targetId);

      entries.forEach((entry) => {
        const roll = Math.ceil(Math.random() * 100);

        const hit = roll <= entry.hitChance.result;

        const logEntry = new CombatLogTorpedoIntercept(flight.id);

        if (hit) {
          flight.setIntercepted();

          entry.candidate
            .getInterceptor()
            .log.getGenericLogEntry()
            .addMessage(
              `Intercepted torpedo ${flight.torpedo.getDisplayName()}  at range ${flight.getCurrentDistanceToTarget()} targeting ${
                target.name
              }.`
            );
        } else {
          entry.candidate
            .getInterceptor()
            .log.getGenericLogEntry()
            .addMessage(
              `Failed to intercept ${flight.torpedo.getDisplayName()} at range ${flight.getCurrentDistanceToTarget()} targeting ${
                target.name
              }.`
            );
        }

        logEntry.addIntercept({
          shipId: entry.candidate.getInterceptor().getShip().id,
          interceptorId: entry.candidate.getInterceptor().id,
          hitChance: entry.hitChance,
          roll,
          success: hit,
        });

        this.getGameData().combatLog.addEntry(logEntry);
        entry.candidate.getInterceptor().handlers.onWeaponFired();
      });
      flight.resetInterceptors();
    });
  }

  private executeTorpedoStrike(flight: TorpedoFlightForIntercept) {
    const target = this.getGameData().ships.getShipById(flight.targetId);

    const torpedoAttack = new CombatLogTorpedoAttack(flight.id, target.id);
    this.getGameData().combatLog.addEntry(torpedoAttack);

    if (flight.intercepted) {
      torpedoAttack.addNote(`Torpedo intercepted`);
      flight.setDone();
      return;
    }

    flight.torpedo.getDamageStrategy().applyDamageFromWeaponFire({
      target,
      torpedoFlight: flight,
      combatLogEntry: torpedoAttack,
    });

    flight.setDone();
  }
}

const sortByPriority = (
  a: TorpedoFlightForIntercept,
  b: TorpedoFlightForIntercept
) => {
  return a.getInterceptionPriority() - b.getInterceptionPriority();
};

const getInterceptorCandidates = (
  torpedoFlights: TorpedoFlightForIntercept[],
  gameData: GameData
) => {
  const candidates = gameData.ships
    .getShips()
    .reduce((all, ship) => {
      return [...all, ...getAllInterceptorsFromShip(ship)];
    }, [] as Weapon[])
    .map((weapon) => new InterceptorCandidate(weapon));

  candidates.forEach((candidate) => {
    torpedoFlights.forEach((flight) => {
      candidate.addEntry(
        gameData.ships.getShipById(flight.targetId),
        flight,
        gameData
      );
    });
  });

  return candidates.filter((candidate) => candidate.hasTargets());
};

const getAllInterceptorsFromShip = (ship: Ship) => {
  return ship.systems
    .getSystems()
    .filter((system) => !system.isDisabled())
    .filter((system) => system.handlers.canIntercept())
    .filter((weapon) => {
      const hasFireOrder = weapon.handlers.hasFireOrder();
      const usedIntercepts = weapon.handlers.getUsedIntercepts();
      const numberOfShots = weapon.handlers.getNumberOfShots();
      const canFire = weapon.handlers.canFire();

      return !hasFireOrder && usedIntercepts < numberOfShots && canFire;
    });
};

const sortInterceptCandidates = (
  a: InterceptionEntry,
  b: InterceptionEntry
) => {
  const changeA = a.hitChance;
  const changeB = b.hitChance;

  if (changeA.result > changeB.result) {
    return 1;
  }

  if (changeA.result < changeB.result) {
    return -1;
  }

  const { overheatPercentage: aHeat, coolingPercent: aCooling } = a.candidate
    .getInterceptor()
    .heat.predictHeatChange();
  const { overheatPercentage: bHeat, coolingPercent: bCooling } = b.candidate
    .getInterceptor()
    .heat.predictHeatChange();

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
};
