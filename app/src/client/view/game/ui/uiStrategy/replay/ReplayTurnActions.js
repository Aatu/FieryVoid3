import {
  ShipWeaponAnimations,
  ShipMovementAnimation,
  ShipSystemAnimation
} from "../../../animation";

import * as THREE from "three";

import AnimationUiStrategy from "../AnimationUiStrategy";
import WeaponFireService from "../../../../../../model/weapon/WeaponFireService.mjs";
import { getSeededRandomGenerator } from "../../../../../../model/utils/math.mjs";
import ShipWeaponAnimationService from "./ShipWeaponAnimationService";
import CombatLogShipMovement from "../../../../../../model/combatLog/CombatLogShipMovement.mjs";
import ShipVelocityAnimation from "../../../animation/ShipVelocityAnimation";
import CombatLogShipVelocity from "../../../../../../model/combatLog/CombatLogShipVelocity.mjs";
import CameraPositionAnimation from "../../../animation/CameraPositionAnimation";
import CombatLogWeaponFire from "../../../../../../model/combatLog/CombatLogWeaponFire.mjs";
import CombatLogGroupedWeaponFire from "../../../../../../model/combatLog/CombatLogGroupedWeaponFire.mjs";
import SystemDestroyedTextAnimation from "../../../animation/SystemDestroyedTextAnimation";
import Vector from "../../../../../../model/utils/Vector.mjs";
import TorpedoMovementAnimation from "../../../animation/TorpedoMovementAnimation";
import CombatLogTorpedoMove from "../../../../../../model/combatLog/CombatLogTorpedoMove.mjs";
import CombatLogGroupedTorpedoAttack from "../../../../../../model/combatLog/CombatLogGroupedTorpedoAttack.mjs";
import { TORPEDO_Z } from "../../../../../../model/gameConfig.mjs";
import ExplosionEffect from "../../../animation/effect/ExplosionEffect";
import TorpedoExplosionHE from "../../../animation/TorpedoExplosion/TorpedoExplosionHE";
import TorpedoExplosionMSV from "../../../animation/TorpedoExplosion/TorpedoExplosionMSV";

const getMovesForShip = (gameDatas, ship) =>
  gameDatas.reduce((moves, gameData) => {
    return [
      ...moves,
      ...gameData.ships.getShipById(ship.id).movement.getMovement()
    ];
  }, []);

const getEndMoveForShip = (gameDatas, ship) =>
  getMovesForShip(gameDatas, ship).pop();

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
      scene
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

    gameData.combatLog.getForReplay().forEach(combatLogEntry => {
      if (combatLogEntry instanceof CombatLogShipMovement) {
        this.buildMovementAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogShipVelocity) {
        this.buildVelocityAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogGroupedWeaponFire) {
        this.buildWeaponFireAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogTorpedoMove) {
        this.buildTorpedoMoveAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogGroupedTorpedoAttack) {
        this.buildTorpedoAttackAnimation(combatLogEntry, gameDatas);
      }
    });
  }

  buildInterceptAnimation(
    gameData,
    targetIcon,
    intercepts,
    interceptTime,
    interceptPosition
  ) {
    const { particleEmitterContainer, shipIconContainer } = this.services;

    const weaponAnimationService = new ShipWeaponAnimationService(
      this.getRandom,
      particleEmitterContainer
    );

    intercepts.forEach(intercept => {
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
        `ShipWeapon${animationName.charAt(0).toUpperCase() +
          animationName.slice(1)}Animation`
      ]({
        getRandom: this.getRandom,
        particleEmitterContainer: particleEmitterContainer,
        weapon,
        getPosition: this.replayContext.wrapGetShootingPosition(
          this.animations
        ),
        args: weapon.callHandler("getWeaponFireAnimationArguments"),
        weaponAnimationService,
        targetIcon,
        shooterIcon: shipIconContainer.getByShip(ship),
        animationStartTime: this.replayContext.getVelocityStart(),
        impactPosition: interceptPosition,
        impactTime: interceptTime,
        totalShots: weapon.callHandler("getTotalBurstSize", null, 1),
        shotsHit: intercept.isSucessfull() ? 1 : 0,
        omitHitExplosion: true
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
      uiState
    } = this.services;
    const gameData = gameDatas[0];

    const attackDuration = 3000;

    const start = this.replayContext.getNextTorpedoAttackStart();
    const cameraDuration = 2000;
    const fireStart = start + cameraDuration;

    let longestDuration = attackDuration;

    const target = gameData.ships.getShipById(combatLogEntry.targetId);
    const targetIcon = shipIconContainer.getByShip(target);

    const { position } = this.replayContext.getShootingPosition(
      targetIcon,
      this.animations
    );

    this.animations.push(
      new CameraPositionAnimation(position, start, fireStart, gameCamera)
    );

    combatLogEntry.entries.forEach(torpedoEntry => {
      const flight = gameData.torpedos.getTorpedoFlightById(
        torpedoEntry.torpedoFlightId
      );

      uiState.addToCombatLog(torpedoEntry);

      const intercepts = gameData.combatLog.getInterceptsFor(torpedoEntry);

      const intercepted = intercepts.some(intercept =>
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

      const endTime = fireStart + attackDuration + this.getRandom() * 500;
      const animation = new TorpedoMovementAnimation(
        torpedoIconContainer.getIconByTorpedoFlight(flight),
        torpedoPosition,
        targetPosition,
        fireStart,
        endTime,
        flight.turnsActive === 1,
        interceptTime,
        true
      );

      const systemsDestroyed = torpedoEntry.getDestroyedSystems(target);

      if (systemsDestroyed.length > 0) {
        this.systemDestroyedTextAnimation.add(
          new Vector(targetPosition.x, targetPosition.y, targetPosition.z),
          systemsDestroyed.map(system => system.getDisplayName()),
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
        interceptPosition
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
              velocity
            },
            this
          )
        );
      } else {
        switch (flight.torpedo.visuals.explosionType) {
          case "HE":
            this.animations.push(
              new TorpedoExplosionHE(
                targetPosition,
                endTime,
                particleEmitterContainer,
                this.getRandom,
                flight.torpedo
              )
            );
            break;
          case "MSV":
            this.animations.push(
              new TorpedoExplosionMSV(
                targetPosition,
                endTime,
                particleEmitterContainer,
                this.getRandom,
                flight.torpedo,
                torpedoEntry.damages.length
              )
            );
            break;
          default:
            this.animations.push(
              new TorpedoExplosionHE(
                targetPosition,
                endTime,
                particleEmitterContainer,
                this.getRandom
              )
            );
        }
      }
    });

    this.replayContext.addTorpedoAttackAnimationDuration(
      cameraDuration + longestDuration + 1000
    );
  }

  buildTorpedoMoveAnimation(combatLogEntry, gameDatas) {
    const { torpedoIconContainer } = this.services;

    const duration = 3000;
    const start = this.replayContext.getTorpedoMovementStart();
    this.replayContext.setTorpedoMovementDuration(duration);

    const flight = gameDatas[0].torpedos.getTorpedoFlightById(
      combatLogEntry.torpedoFlightId
    );

    const startTime = start + this.getRandom() * 2000;
    const endTime = start + duration + this.getRandom() * 1000;
    const animation = new TorpedoMovementAnimation(
      torpedoIconContainer.getIconByTorpedoFlight(flight),
      combatLogEntry.startPosition.setZ(TORPEDO_Z),
      combatLogEntry.endPosition.setZ(TORPEDO_Z),
      startTime,
      endTime,
      flight.turnsActive === 1
    );

    this.animations.push(animation);
  }

  buildWeaponFireAnimation(combatLogEntry, gameDatas) {
    const {
      shipIconContainer,
      gameCamera,
      particleEmitterContainer,
      uiState
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

    const { facing, position } = this.replayContext.getShootingPosition(
      targetIcon,
      this.animations
    );

    this.animations.push(
      new CameraPositionAnimation(position, start, fireStart, gameCamera)
    );

    combatLogEntry.entries.forEach(fireEntry => {
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
        `ShipWeapon${animationName.charAt(0).toUpperCase() +
          animationName.slice(1)}Animation`
      ]({
        getRandom: this.getRandom,
        particleEmitterContainer: particleEmitterContainer,
        weapon,
        getPosition: this.replayContext.wrapGetShootingPosition(
          this.animations
        ),
        args: weapon.callHandler("getWeaponFireAnimationArguments"),
        weaponAnimationService,
        targetIcon,
        shooterIcon: shipIconContainer.getByShip(shooter),
        animationStartTime: fireStart,
        totalShots: fireEntry.totalShots,
        shotsHit: fireEntry.shotsHit
      });

      this.animations.push(animation);
      const duration = animation.getDuration();

      if (duration > longestDuration) {
        longestDuration = duration;
      }

      const systemsDestroyed = fireEntry.getDestroyedSystems(target);

      if (systemsDestroyed.length > 0) {
        this.systemDestroyedTextAnimation.add(
          new Vector(position.x, position.y, position.z + targetIcon.shipZ),
          systemsDestroyed.map(system => system.getDisplayName()),
          fireStart + duration - 1000
        );
      }
    });

    this.replayContext.addFireAnimationDuration(
      cameraDuration + longestDuration
    );
  }

  buildVelocityAnimation(combatLogEntry, gameDatas) {
    const { shipIconContainer } = this.services;

    const duration = 5000;
    const start = this.replayContext.getVelocityStart();
    this.replayContext.setVelocityDuration(duration);

    const icon = shipIconContainer.getById(combatLogEntry.shipId);
    const ship = icon.ship;

    icon.show();
    this.animations.push(
      new ShipVelocityAnimation(
        icon,
        getEndMoveForShip(gameDatas, ship),
        start,
        start + duration
      )
    );
  }

  buildMovementAnimation(combatLogEntry, gameDatas) {
    const { shipIconContainer } = this.services;

    const duration = 5000;
    const start = 0;

    const icon = shipIconContainer.getById(combatLogEntry.shipId);
    const ship = icon.ship;

    icon.show();

    const animation = new ShipMovementAnimation(
      icon,
      getMovesForShip(gameDatas, ship),
      start,
      duration
    );

    if (animation.doesMove()) {
      console.log("animation moves");
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
      particleEmitterContainer
    } = this.services;
    shipIconContainer.getArray().forEach(function(icon) {
      icon.hide();
    }, this);

    uiState.hideCombatLog();

    particleEmitterContainer.release(this);
    this.animations.forEach(animation => animation.deactivate());

    return super.deactivate();
  }
}

export default ReplayTurnActions;
