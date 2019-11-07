import { ShipWeaponAnimations } from "../../../animation";

import AnimationUiStrategy from "../AnimationUiStrategy";
import WeaponFireService from "../../../../../../model/weapon/WeaponFireService.mjs";
import { getSeededRandomGenerator } from "../../../../../../model/utils/math.mjs";

class ReplayShipWeaponFire extends AnimationUiStrategy {
  constructor(particleEmitterContainer, replayContext) {
    super();
    this.particleEmitterContainer = particleEmitterContainer;
    this.replayContext = replayContext;

    this.ready = false;
  }

  async newTurn(gameDatas) {
    const { shipIconContainer } = this.services;

    await shipIconContainer.shipsLoaded();
    await this.particleEmitterContainer.ready();

    const gameData = gameDatas[0];

    const getRandom = getSeededRandomGenerator(
      "id" + gameData.id + "turn" + gameData.turn
    );

    const weaponFireService = new WeaponFireService().update(gameData);

    gameData.ships.getShips().forEach(ship => {
      const fireOrders = weaponFireService.getAllFireOrdersForShip(ship);

      fireOrders.forEach(fireOrder => {
        const target = gameData.ships.getShipById(fireOrder.targetId);
        const weapon = ship.systems.getSystemById(fireOrder.weaponId);

        const animationName = weapon.callHandler("getWeaponFireAnimationName");

        if (!animationName) {
          return;
        }

        const animation = new ShipWeaponAnimations[
          `ShipWeapon${animationName.charAt(0).toUpperCase() +
            animationName.slice(1)}Animation`
        ](
          fireOrder,
          weapon,
          shipIconContainer.getByShip(ship),
          shipIconContainer.getByShip(target),
          this.replayContext,
          getRandom,
          this.particleEmitterContainer,
          weapon.callHandler("getWeaponFireAnimationArguments")
        );

        this.animations.push(animation);
      });
    });

    this.ready = true;
  }

  deactivate() {
    return super.deactivate();
  }
}

export default ReplayShipWeaponFire;
