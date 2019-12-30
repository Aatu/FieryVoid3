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

    this.ready = false;
  }

  async newTurn(gameDatas) {
    const { shipIconContainer, particleEmitterContainer } = this.services;

    await shipIconContainer.shipsLoaded();
    await particleEmitterContainer.ready();

    const gameData = gameDatas[0];

    this.getRandom = getSeededRandomGenerator(
      "id" + gameData.id + "turn" + gameData.turn
    );

    gameData.combatLog.getForReplay().forEach(combatLogEntry => {
      if (combatLogEntry instanceof CombatLogShipMovement) {
        this.buildMovementAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogShipVelocity) {
        this.buildVelocityAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogWeaponFire) {
        this.buildWeaponFireAnimation(combatLogEntry, gameDatas);
      }
    });

    console.log(gameData.combatLog.getForReplay());
    console.log("context", this.replayContext);
  }

  buildWeaponFireAnimation(combatLogEntry, gameDatas) {
    const {
      shipIconContainer,
      gameCamera,
      particleEmitterContainer
    } = this.services;
    const gameData = gameDatas[0];
    const start = this.replayContext.getNextFireStart();
    const cameraDuration = 2000;
    const fireStart = start + cameraDuration;

    console.log(combatLogEntry);

    const weaponFireService = new WeaponFireService().update(gameData);
    const weaponAnimationService = new ShipWeaponAnimationService(
      this.getRandom,
      particleEmitterContainer
    );

    const fireOrder = weaponFireService.getFireOrderById(
      combatLogEntry.fireOrderId
    );

    const shooter = gameData.ships.getShipById(fireOrder.shooterId);
    const weapon = shooter.systems.getSystemById(fireOrder.weaponId);
    const target = gameData.ships.getShipById(fireOrder.targetId);

    const targetIcon = shipIconContainer.getByShip(target);

    console.log(fireOrder);

    const { facing, position } = this.replayContext.getShootingPosition(
      targetIcon,
      this.animations
    );

    console.log(position);

    this.animations.push(
      new CameraPositionAnimation(position, start, fireStart, gameCamera)
    );

    const animationName = weapon.callHandler("getWeaponFireAnimationName");

    if (!animationName) {
      return;
    }

    const animation = new ShipWeaponAnimations[
      `ShipWeapon${animationName.charAt(0).toUpperCase() +
        animationName.slice(1)}Animation`
    ](
      fireStart,
      combatLogEntry,
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

    this.replayContext.addFireAnimationDuration(
      cameraDuration + animation.getDuration()
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
    const { shipIconContainer } = this.services;
    shipIconContainer.getArray().forEach(function(icon) {
      icon.hide();
    }, this);

    return super.deactivate();
  }
}

export default ReplayTurnActions;
