import * as THREE from "three";
import ShipWeaponAnimation from "./ShipWeaponAnimation";
import CombatLogWeaponFire from "@fieryvoid3/model/src/combatLog/CombatLogWeaponFire";
import FireOrder from "@fieryvoid3/model/src/weapon/FireOrder";
import Weapon from "@fieryvoid3/model/src/unit/system/weapon/Weapon";
import ShipObject from "../../renderer/ships/ShipObject";
import { ParticleEmitterContainer } from "../particle";
import ShipWeaponAnimationService from "../../ui/uiStrategy/replay/ShipWeaponAnimationService";

type ShipWeaponBoltAnimationArgs = {
  speed: number;
  explosionSize: number;
};

class ShipWeaponBoltAnimation extends ShipWeaponAnimation {
  private extraWait: number;
  private animations: Animation[];
  private explosion: Animation | null;

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
    ) => { position: THREE.Vector3; facing: number },
    getRandom: () => number,
    particleEmitterContainer: ParticleEmitterContainer,
    args: ShipWeaponBoltAnimationArgs,
    weaponAnimationService: ShipWeaponAnimationService
  ) {
    super(getRandom, particleEmitterContainer);

    const hit = Boolean(combatLogEntry.shotsHit);

    this.extraWait = getRandom() * 2000;
    const startTime = time + this.extraWait;
    const speed = args.speed || 1;

    const startPosition = getPosition(shooterIcon, startTime).position.add(
      this.getLocationForSystem(
        weapon,
        shooterIcon,
        getPosition(shooterIcon, startTime).facing
      )
    );
    startPosition.z += shooterIcon.shipZ;

    const endPosition = getPosition(targetIcon, startTime).position.add(
      this.getRandomPosition(20)
    );
    endPosition.z += targetIcon.shipZ;

    const distance = startPosition.distanceTo(endPosition);
    this.duration = distance / speed;

    let fade = 0;

    if (!hit) {
      const extra = getRandom() * 300 + 300;
      this.duration += extra;
      fade = extra * 0.8;
    }

    this.animations = [];

    this.animations.push(
      weaponAnimationService.getBoltEffect(
        startTime,
        startPosition,
        endPosition.clone(),
        speed,
        fade,
        this.duration,
        args,
        this
      )
    );

    this.explosion = null;

    if (!combatLogEntry.causedDamage()) {
      return;
    }

    if (hit) {
      weaponAnimationService.getDamageExplosion(
        args.explosionSize,
        endPosition,
        startTime + this.duration,
        this
      );

      this.duration += 1000;
    }
  }

  getDuration() {
    return this.duration + this.extraWait;
  }

  deactivate() {
    this.particleEmitterContainer.release(this);
  }
}

export default ShipWeaponBoltAnimation;
