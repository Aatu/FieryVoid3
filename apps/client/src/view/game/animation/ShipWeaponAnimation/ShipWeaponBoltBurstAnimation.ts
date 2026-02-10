import ShipWeaponAnimation from "./ShipWeaponAnimation";
import BoltEffect, { BoltArgs } from "../effect/BoltEffect";
import CombatLogWeaponFire from "@fieryvoid3/model/src/combatLog/CombatLogWeaponFire";
import FireOrder from "@fieryvoid3/model/src/weapon/FireOrder";
import Weapon from "@fieryvoid3/model/src/unit/system/weapon/Weapon";
import ShipObject from "../../renderer/ships/ShipObject";
import { ParticleEmitterContainer } from "../particle";
import ShipWeaponAnimationService from "../../ui/uiStrategy/replay/ShipWeaponAnimationService";
import Vector from "@fieryvoid3/model/src/utils/Vector";

type ShipWeaponBoltBurstAnimationArgs = {
  speed: number;
  explosionSize: number;
} & BoltArgs;

class ShipWeaponBoltBurstAnimation extends ShipWeaponAnimation {
  private animations: BoltEffect[];
  private extraWait: number;
  private startExtra: number;

  constructor(
    time: number,
    combatLogEntry: CombatLogWeaponFire,
    fireOrder: FireOrder,
    weapon: Weapon,
    shooterIcon: ShipObject,
    targetIcon: ShipObject,
    getPosition: (
      icon: ShipObject,
      time: number
    ) => { position: Vector; facing: number },
    getRandom: () => number,
    particleEmitterContainer: ParticleEmitterContainer,
    args: ShipWeaponBoltBurstAnimationArgs,
    weaponAnimationService: ShipWeaponAnimationService
  ) {
    super(getRandom, particleEmitterContainer);
    this.animations = [];

    const missesFirst = this.getRandom() > 0.5;
    const speed = args.speed || 1;

    this.extraWait = getRandom() * 2000;
    const startTime = time + this.extraWait;

    const startPosition = getPosition(shooterIcon, startTime).position.add(
      this.getLocationForSystem(
        weapon,
        shooterIcon,
        getPosition(shooterIcon, startTime).facing
      )
    );
    startPosition.z += shooterIcon.shipZ;

    let endPosition = getPosition(targetIcon, startTime).position.add(
      this.getRandomPosition(20)
    );
    endPosition.z += targetIcon.shipZ;

    const distance = startPosition.distanceTo(endPosition);
    this.duration = distance / speed;

    const offsetVector = this.getRandomPosition(5);

    const missExtra = getRandom() * 300 + 300;
    const missFade = missExtra * 0.8;

    const totalShots = combatLogEntry.totalShots;
    const shotsHit = combatLogEntry.shotsHit;

    this.startExtra = 0;
    for (let shotNumber = 1; shotNumber <= totalShots; shotNumber++) {
      this.startExtra = (30 / speed) * shotNumber;

      if (
        (missesFirst && shotNumber <= totalShots - shotsHit) ||
        (!missesFirst && shotNumber > shotsHit)
      ) {
        this.animations.push(
          weaponAnimationService.getBoltEffect(
            this.startExtra + startTime,
            startPosition,
            endPosition.clone(),
            speed,
            missFade,
            this.duration + missExtra,
            args,
            this
          )
        );
      } else {
        this.animations.push(
          weaponAnimationService.getBoltEffect(
            this.startExtra + startTime,
            startPosition,
            endPosition.clone(),
            speed,
            0,
            this.duration,
            args,
            this
          )
        );

        weaponAnimationService.getDamageExplosion(
          args.explosionSize,
          endPosition,
          this.startExtra + startTime + this.duration,
          this
        );
      }

      endPosition = endPosition.add(offsetVector);
    }
  }

  getDuration() {
    return this.duration + this.extraWait + this.startExtra + 1000;
  }

  deactivate() {
    this.particleEmitterContainer.release(this);
  }
}

export default ShipWeaponBoltBurstAnimation;
