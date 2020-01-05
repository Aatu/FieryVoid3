import {
  ShipWeaponAnimations,
  ShipMovementAnimation,
  ShipSystemAnimation
} from "../../../animation";

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
      }
    });
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
      ](
        fireStart,
        fireEntry,
        fireOrder,
        weapon,
        shipIconContainer.getByShip(shooter),
        targetIcon,
        this.replayContext.wrapGetShootingPosition(this.animations),
        this.getRandom,
        particleEmitterContainer,
        weapon.callHandler("getWeaponFireAnimationArguments"),
        weaponAnimationService
      );

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
    this.replayContext.setMovementDuration(duration);

    const icon = shipIconContainer.getById(combatLogEntry.shipId);
    const ship = icon.ship;

    icon.show();
    this.animations.push(
      new ShipMovementAnimation(
        icon,
        getMovesForShip(gameDatas, ship),
        start,
        duration
      )
    );

    this.animations.push(
      new ShipSystemAnimation(
        icon,
        gameDatas[0].ships.getShipById(icon.ship.id)
      )
    );
  }

  deactivate() {
    const { shipIconContainer, uiState } = this.services;
    shipIconContainer.getArray().forEach(function(icon) {
      icon.hide();
    }, this);

    uiState.hideCombatLog();

    return super.deactivate();
  }
}

export default ReplayTurnActions;
