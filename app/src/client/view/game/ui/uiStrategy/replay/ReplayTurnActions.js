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

    const getRandom = getSeededRandomGenerator(
      "id" + gameData.id + "turn" + gameData.turn
    );

    const weaponFireService = new WeaponFireService().update(gameData);
    const weaponAnimationService = new ShipWeaponAnimationService(
      getRandom,
      particleEmitterContainer
    );

    gameData.combatLog.entries.forEach(combatLogEntry => {
      if (combatLogEntry instanceof CombatLogShipMovement) {
        this.buildMovementAnimation(combatLogEntry, gameDatas);
      } else if (combatLogEntry instanceof CombatLogShipVelocity) {
        this.buildVelocityAnimation(combatLogEntry, gameDatas);
      }
    });

    console.log(gameData.combatLog);
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
