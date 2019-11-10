import { ShipWeaponAnimations } from "../../../animation";

import AnimationUiStrategy from "../AnimationUiStrategy";
import WeaponFireService from "../../../../../../model/weapon/WeaponFireService.mjs";
import { getSeededRandomGenerator } from "../../../../../../model/utils/math.mjs";
import ShipWeaponAnimationService from "./ShipWeaponAnimationService";

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
    const weaponAnimationService = new ShipWeaponAnimationService(
      getRandom,
      this.particleEmitterContainer
    );

    console.log("WEAPON FIRE, new turn", gameDatas);

    const start = performance.now();

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
          weapon.callHandler("getWeaponFireAnimationArguments"),
          weaponAnimationService
        );

        this.animations.push(animation);
      });
    });

    this.ready = true;

    const end = performance.now();
    console.log("Fire effects took", end - start);
  }
}

export default ReplayShipWeaponFire;
