import {
  ShipWeaponAnimations,
  ShipMovementAnimation,
  ShipSystemAnimation,
} from "../../../animation";

import * as THREE from "three";

import AnimationUiStrategy from "../AnimationUiStrategy";
import WeaponFireService from "../../../../../../model/weapon/WeaponFireService.mjs";
import { getSeededRandomGenerator } from "../../../../../../model/utils/math.mjs";
import ShipWeaponAnimationService from "./ShipWeaponAnimationService";
import CombatLogShipMovement from "../../../../../../model/combatLog/CombatLogShipMovement.mjs";
import CameraPositionAnimation from "../../../animation/CameraPositionAnimation";
import CombatLogGroupedWeaponFire from "../../../../../../model/combatLog/CombatLogGroupedWeaponFire.mjs";
import SystemDestroyedTextAnimation from "../../../animation/SystemDestroyedTextAnimation";
import Vector from "../../../../../../model/utils/Vector.mjs";
import TorpedoMovementAnimation from "../../../animation/TorpedoMovementAnimation";
import CombatLogGroupedTorpedoAttack from "../../../../../../model/combatLog/CombatLogGroupedTorpedoAttack.mjs";
import { TORPEDO_Z } from "../../../../../../model/gameConfig.mjs";
import ExplosionEffect from "../../../animation/effect/ExplosionEffect";
import TorpedoExplosionHE from "../../../animation/TorpedoExplosion/TorpedoExplosionHE";
import TorpedoExplosionMSV from "../../../animation/TorpedoExplosion/TorpedoExplosionMSV";
import CombatLogTorpedoLaunch from "../../../../../../model/combatLog/CombatLogTorpedoLaunch.mjs";
import ShipDamageAnimation from "../../../animation/ShipDamageAnimation";
import ShipDestroyedAnimation from "../../../animation/ShipDestroyedAnimation";

const getMovesForShip = (gameDatas, ship) =>
  gameDatas.reduce((moves, gameData) => {
    return [
      ...moves,
      ...gameData.ships.getShipById(ship.id).movement.getMovement(),
    ];
  }, []);

const getEndMoveForShip = (gameDatas, ship) =>
  getMovesForShip(gameDatas, ship).pop();

const getStartMoveForShip = (gameDatas, ship) =>
  getMovesForShip(gameDatas, ship).shift();

const getShipStartPositionAndFacingForShip = (gameDatas, ship) => {
  const move = getStartMoveForShip(gameDatas, ship);

  return {
    position: move.position,
    facing: move.facing,
  };
};

class ReplayTurnActions extends AnimationUiStrategy {
  constructor(replayContext) {
    super();
    this.replayContext = replayContext;

    this.systemDestroyedTextAnimation = null;
    this.ready = false;
  }

  async newTurn(gameDatas) {
    const {
      shipIconContainer,
      particleEmitterContainer,
      uiState,
      scene,
    } = this.services;

    await shipIconContainer.shipsLoaded();
    await particleEmitterContainer.ready();

    const gameData = gameDatas[0];

    this.getRandom = getSeededRandomGenerator(
      "id" + gameData.id + "turn" + gameData.turn
    );

    uiState.startCombatLog(this.replayContext, gameData);

    this.systemDestroyedTextAnimation = new SystemDestroyedTextAnimation(scene);
    this.animations.push(this.systemDestroyedTextAnimation);

    gameData.combatLog.getForReplay().forEach((combatLogEntry) => {
      if (combatLogEntry instanceof CombatLogShipMovement) {
        this.buildMovementAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogGroupedWeaponFire) {
        this.buildWeaponFireAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogTorpedoLaunch) {
        this.buildTorpedoMoveAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogGroupedTorpedoAttack) {
        this.buildTorpedoAttackAnimation(combatLogEntry, gameDatas);
      }
    });

    this.buildShipDamageAnimations(gameDatas);
  }

  buildDestroyedShipsAnimation(gameDatas, ship) {
    const {
      gameCamera,
      shipIconContainer,
      particleEmitterContainer,
      scene,
    } = this.services;

    const start = this.replayContext.getDestroyedShipsStart();
    const cameraDuration = 2000;
    const effectStart = start + cameraDuration;

    const endMove = getEndMoveForShip(gameDatas, ship);
    const position = endMove.getPosition();
    const icon = shipIconContainer.getByShip(ship);

    this.animations.push(
      new CameraPositionAnimation(position, start, effectStart, gameCamera)
    );

    this.animations.push(
      new ShipDestroyedAnimation(
        icon,
        endMove.getFacing(),
        endMove.getPosition(),
        effectStart,
        this.getRandom,
        particleEmitterContainer,
        scene
      )
    );

    this.replayContext.addDestroyedShipsDuration(cameraDuration + 5000);
  }

  buildShipDamageAnimations(gameDatas) {
    const { shipIconContainer } = this.services;

    gameDatas[0].ships.getShips().forEach((ship) => {
      const icon = shipIconContainer.getByShip(ship);
      const systemsDestroyed = this.replayContext.getDestroyedStructuresByShip(
        ship
      );

      let end = null;

      if (ship.isDestroyedThisTurn()) {
        end = this.replayContext.getDestroyedShipsStart() + 2000;
        this.buildDestroyedShipsAnimation(gameDatas, ship);
      }

      let destroyedSections = ship.systems.sections
        .getSectionsWithStructure()
        .filter((section) => {
          const structure = section.getStructure();
          return (
            structure.isDestroyed() &&
            systemsDestroyed.every(({ systems }) =>
              systems.every((system) => system.id !== structure.id)
            )
          );
        });

      const destroyedAnimations = [];

      if (destroyedSections.length > 0) {
        destroyedAnimations.push({
          sections: destroyedSections,
          start: 0,
          end: null,
        });
      }

      systemsDestroyed.forEach(({ time, systems }) => {
        const newDestroyed = ship.systems.sections
          .getSectionsWithStructure()
          .filter((section) => {
            const structure = section.getStructure();
            return systems.some((system) => system.id === structure.id);
          });

        time += this.getRandom() * 500 + 500;
        destroyedSections = [...destroyedSections, ...newDestroyed];

        if (destroyedAnimations[destroyedAnimations.length - 1]) {
          destroyedAnimations[destroyedAnimations.length - 1].end = time;
        }

        destroyedAnimations.push({
          sections: destroyedSections,
          start: time,
          end: end,
        });
      });

      destroyedAnimations.forEach(({ sections, start, end }) => {
        this.animations.push(
          new ShipDamageAnimation(icon, sections, start, end)
        );
      });
    });
  }

  buildInterceptAnimation(
    gameData,
    targetIcon,
    intercepts,
    interceptTime,
    interceptPosition,
    gameDatas
  ) {
    const { particleEmitterContainer, shipIconContainer } = this.services;

    const weaponAnimationService = new ShipWeaponAnimationService(
      this.getRandom,
      particleEmitterContainer
    );

    intercepts.forEach((intercept) => {
      const ship = gameData.ships.getShipById(intercept.shipId);
      const weapon = ship.systems.getSystemById(intercept.weaponId);

      if (!intercept.isSucessfull()) {
        return;
      }

      const animationName = weapon.callHandler("getWeaponFireAnimationName");

      if (!animationName) {
        return;
      }

      const animation = new ShipWeaponAnimations[
        `ShipWeapon${
          animationName.charAt(0).toUpperCase() + animationName.slice(1)
        }Animation`
      ]({
        getRandom: this.getRandom,
        particleEmitterContainer: particleEmitterContainer,
        weapon,
        getPosition: (ship) =>
          getShipStartPositionAndFacingForShip(gameDatas, ship),
        args: weapon.callHandler("getWeaponFireAnimationArguments"),
        weaponAnimationService,
        targetIcon,
        shooterIcon: shipIconContainer.getByShip(ship),
        animationStartTime: 0,
        impactPosition: interceptPosition,
        impactTime: interceptTime,
        totalShots: weapon.callHandler("getTotalBurstSize", null, 1),
        shotsHit: intercept.isSucessfull() ? 1 : 0,
        omitHitExplosion: true,
      });

      this.animations.push(animation);
    });
  }

  buildTorpedoAttackAnimation(combatLogEntry, gameDatas) {
    const {
      shipIconContainer,
      gameCamera,
      particleEmitterContainer,
      torpedoIconContainer,
      uiState,
    } = this.services;
    const gameData = gameDatas[0];

    const attackDuration = 3000;

    const start = this.replayContext.getNextTorpedoAttackStart();
    const cameraDuration = 2000;
    const fireStart = start + cameraDuration;

    let longestDuration = attackDuration;

    const target = gameData.ships.getShipById(combatLogEntry.targetId);
    const targetIcon = shipIconContainer.getByShip(target);

    const position = getStartMoveForShip(
      gameDatas,
      targetIcon.ship
    ).getPosition();

    this.animations.push(
      new CameraPositionAnimation(position, start, fireStart, gameCamera)
    );

    combatLogEntry.entries.forEach((torpedoEntry) => {
      const flight = gameData.torpedos.getTorpedoFlightById(
        torpedoEntry.torpedoFlightId
      );

      uiState.addToCombatLog(torpedoEntry);

      const intercepts = gameData.combatLog.getInterceptsFor(torpedoEntry);

      const intercepted = intercepts.some((intercept) =>
        intercept.isSucessfull()
      );

      const interceptTime = intercepted
        ? fireStart + (attackDuration - 1000) + this.getRandom() * 1000
        : null;

      const targetPosition = new Vector(position)
        .setZ(targetIcon.shipZ)
        .add(
          new Vector(this.getRandom() * 30 - 15, this.getRandom() * 30 - 15, 0)
        );

      const attackDistance = 1000;
      const launchPosition = flight.launchPosition;
      const torpedoPosition = launchPosition
        .sub(targetPosition)
        .normalize()
        .multiplyScalar(attackDistance)
        .add(targetPosition)
        .setZ(TORPEDO_Z);

      const msvDistance = this.getRandom() * 200 + 300;
      const msvPosition =
        flight.torpedo.damageStrategy.msv && !intercepted
          ? launchPosition
              .sub(targetPosition)
              .normalize()
              .multiplyScalar(msvDistance)
              .add(targetPosition)
              .setZ(TORPEDO_Z)
          : null;

      const flightDuration = msvPosition
        ? attackDuration * ((attackDistance - msvDistance) / attackDistance)
        : attackDuration;

      const randomFlightDuration = this.getRandom() * 500;
      const endTime = fireStart + attackDuration + randomFlightDuration;
      const flightEndTime = fireStart + flightDuration + randomFlightDuration;

      const speed = attackDistance / attackDuration;

      const animation = new TorpedoMovementAnimation(
        torpedoIconContainer.getIconByTorpedoFlight(flight),
        torpedoPosition,
        msvPosition ? msvPosition : targetPosition,
        fireStart,
        flightEndTime,
        flight.turnsActive === 1,
        interceptTime,
        true
      );

      const systemsDestroyed = torpedoEntry.getDestroyedSystems(target);

      if (systemsDestroyed.length > 0) {
        this.systemDestroyedTextAnimation.add(
          new Vector(targetPosition.x, targetPosition.y, targetPosition.z),
          systemsDestroyed.map((system) => system.getDisplayName()),
          endTime
        );
      }

      const velocity = targetPosition
        .sub(launchPosition)
        .normalize()
        .multiplyScalar(attackDistance / attackDuration)
        .multiplyScalar(0.5);

      const interceptPosition = animation.getInterceptPosition();

      this.animations.push(animation);

      this.buildInterceptAnimation(
        gameData,
        targetIcon,
        intercepts,
        interceptTime,
        interceptPosition,
        gameDatas
      );

      if (intercepted) {
        this.animations.push(
          new ExplosionEffect(
            particleEmitterContainer,
            this.getRandom,
            {
              position: interceptPosition,
              time: interceptTime,
              duration: 250 + this.getRandom() * 250,
              type: "glow",
              size: this.getRandom() * 5 + 5,
              color: new THREE.Color(1.0, 0.9, 0.8),
              velocity,
            },
            this
          )
        );
      } else {
        switch (flight.torpedo.visuals.explosionType) {
          case "MSV":
            this.animations.push(
              new TorpedoExplosionMSV(
                targetPosition,
                flightEndTime,
                endTime,
                particleEmitterContainer,
                this.getRandom,
                flight.torpedo,
                torpedoEntry.damages,
                targetIcon,
                (ship) => getShipStartPositionAndFacingForShip(gameDatas, ship),
                msvPosition,
                speed
              )
            );
            break;
          case "HE":
          default:
            this.animations.push(
              new TorpedoExplosionHE(
                (ship) => getShipStartPositionAndFacingForShip(gameDatas, ship),
                endTime,
                particleEmitterContainer,
                this.getRandom,
                flight.torpedo,
                targetIcon
              )
            );
            break;
        }
      }
    });

    this.replayContext.addTorpedoAttackAnimationDuration(
      cameraDuration + longestDuration + 1000
    );
  }

  buildTorpedoMoveAnimation(combatLogEntry, gameDatas) {
    const { torpedoIconContainer } = this.services;

    const duration = 5000;
    const start = this.replayContext.getMovementStart();
    this.replayContext.setMovementDuration(duration);

    const flight = gameDatas[0].torpedos.getTorpedoFlightById(
      combatLogEntry.torpedoFlightId
    );

    const startTime = start + this.getRandom() * 2000;
    const endTime = start + duration + this.getRandom() * 1000;
    const animation = new TorpedoMovementAnimation(
      torpedoIconContainer.getIconByTorpedoFlight(flight),
      flight.launchPosition.setZ(TORPEDO_Z),
      flight.strikePosition.setZ(TORPEDO_Z),
      startTime,
      endTime,
      true
    );

    this.animations.push(animation);
  }

  buildWeaponFireAnimation(combatLogEntry, gameDatas) {
    const {
      shipIconContainer,
      gameCamera,
      particleEmitterContainer,
      uiState,
    } = this.services;
    const gameData = gameDatas[0];

    const weaponFireService = new WeaponFireService().update(gameData);
    const weaponAnimationService = new ShipWeaponAnimationService(
      this.getRandom,
      particleEmitterContainer
    );

    const start = this.replayContext.getNextFireStart();
    const cameraDuration = 2000;
    const fireStart = start + cameraDuration;

    let longestDuration = 0;

    const target = gameData.ships.getShipById(combatLogEntry.targetId);
    const targetIcon = shipIconContainer.getByShip(target);

    const position = getStartMoveForShip(
      gameDatas,
      targetIcon.ship
    ).getPosition();

    this.animations.push(
      new CameraPositionAnimation(position, start, fireStart, gameCamera)
    );

    combatLogEntry.entries.forEach((fireEntry) => {
      const fireOrder = weaponFireService.getFireOrderById(
        fireEntry.fireOrderId
      );

      uiState.addToCombatLog(fireEntry);

      const shooter = gameData.ships.getShipById(fireOrder.shooterId);
      const weapon = shooter.systems.getSystemById(fireOrder.weaponId);

      const animationName = weapon.callHandler("getWeaponFireAnimationName");

      if (!animationName) {
        return;
      }

      const animation = new ShipWeaponAnimations[
        `ShipWeapon${
          animationName.charAt(0).toUpperCase() + animationName.slice(1)
        }Animation`
      ]({
        getRandom: this.getRandom,
        particleEmitterContainer: particleEmitterContainer,
        weapon,
        getPosition: (ship) =>
          getShipStartPositionAndFacingForShip(gameDatas, ship),
        args: weapon.callHandler("getWeaponFireAnimationArguments"),
        weaponAnimationService,
        targetIcon,
        shooterIcon: shipIconContainer.getByShip(shooter),
        animationStartTime: fireStart,
        totalShots: fireEntry.totalShots,
        shotsHit: fireEntry.shotsHit,
        fireEntry,
      });

      this.animations.push(animation);
      const duration = animation.getDuration();

      if (duration > longestDuration) {
        longestDuration = duration;
      }

      const systemsDestroyed = fireEntry.getDestroyedSystems(target);

      if (systemsDestroyed.length > 0) {
        const systemDestroyedTime = fireStart + duration - 1000;
        this.replayContext.noteDestroyedSystem(
          target,
          systemDestroyedTime,
          systemsDestroyed
        );
        this.systemDestroyedTextAnimation.add(
          new Vector(position.x, position.y, position.z + targetIcon.shipZ),
          systemsDestroyed.map((system) => system.getDisplayName()),
          systemDestroyedTime
        );
      }
    });

    this.replayContext.addFireAnimationDuration(
      cameraDuration + longestDuration
    );
  }

  buildMovementAnimation(combatLogEntry, gameDatas) {
    const { shipIconContainer } = this.services;

    const duration = 5000;
    const start = this.replayContext.getMovementStart();

    const icon = shipIconContainer.getById(combatLogEntry.shipId);
    const ship = icon.ship;

    icon.show();

    const animation = new ShipMovementAnimation(
      icon,
      getMovesForShip(gameDatas, ship),
      start,
      start + duration
    );

    if (animation.doesMove()) {
      this.replayContext.setMovementDuration(duration);
    }

    this.animations.push(animation);

    this.animations.push(
      new ShipSystemAnimation(
        icon,
        gameDatas[0].ships.getShipById(icon.ship.id)
      )
    );
  }

  deactivate() {
    const {
      shipIconContainer,
      uiState,
      particleEmitterContainer,
    } = this.services;
    shipIconContainer.getArray().forEach(function (icon) {
      icon.hide();
    }, this);

    uiState.hideCombatLog();

    particleEmitterContainer.release(this);
    this.animations.forEach((animation) => animation.deactivate());

    return super.deactivate();
  }
}

export default ReplayTurnActions;
