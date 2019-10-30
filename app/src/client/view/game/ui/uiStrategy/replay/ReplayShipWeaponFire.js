import { ShipWeaponAnimations } from "../../../animation";

import AnimationUiStrategy from "../AnimationUiStrategy";
import WeaponFireService from "../../../../../../model/weapon/WeaponFireService.mjs";
import { getSeededRandomGenerator } from "../../../../../../model/utils/math.mjs";

class ReplayShipWeaponFire extends AnimationUiStrategy {
  constructor(particleEmitterContainer, replayShipMovement) {
    super();
    this.particleEmitterContainer = particleEmitterContainer;
    this.replayShipMovement = replayShipMovement;
  }

  async newTurn(gameDatas) {
    const { shipIconContainer } = this.services;

    await shipIconContainer.shipsLoaded();

    console.log("fire awaited");

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

        console.log("animationName", animationName);

        const animation = new ShipWeaponAnimations[
          `ShipWeapon${animationName.charAt(0).toUpperCase() +
            animationName.slice(1)}Animation`
        ](
          fireOrder,
          weapon,
          shipIconContainer.getByShip(ship),
          shipIconContainer.getByShip(target),
          this.replayShipMovement,
          getRandom,
          this.particleEmitterContainer,
          weapon.callHandler("getWeaponFireAnimationArguments")
        );

        this.animations.push(animation);
      });
    });
  }

  deactivate() {
    this.particleEmitterContainer.cleanUp();
    return super.deactivate();
  }
}

export default ReplayShipWeaponFire;
