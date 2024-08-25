import ShipWeaponAnimation from "./ShipWeaponAnimation";
import BoltEffect from "../effect/BoltEffect";
import ExplosionEffect from "../effect/ExplosionEffect";
import ShipWeaponAnimationService from "../../ui/uiStrategy/replay/ShipWeaponAnimationService";
import ParticleEmitterContainer from "../particle/ParticleEmitterContainer";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipObject from "../../renderer/ships/ShipObject";
import Weapon from "@fieryvoid3/model/src/unit/system/weapon/Weapon";
import Vector from "@fieryvoid3/model/src/utils/Vector";

type Props = {
  weaponAnimationService: ShipWeaponAnimationService;
  getRandom: () => number;
  particleEmitterContainer: ParticleEmitterContainer;
  args: {
    speed: number;
    explosionSize: number;
    explosionType: string;
    size: number;
    length: number;
  };
  totalShots: number;
  shotsHit: number;
  targetIcon: ShipObject;
  impactPosition: Vector;
  getPosition: (ship: Ship) => { position: Vector; facing: number };
  fireEntry: { damages: { entries: { systemId: number }[] }[] };
  shooterIcon: ShipObject;
  weapon: Weapon;
  omitHitExplosion: boolean;
  animationStartTime: number;
  impactTime: number;
};

class ShipWeaponUniversalBoltAnimation extends ShipWeaponAnimation {
  private shots: { startExtra: number; hit: boolean; offset: Vector }[] = [];
  private animations: (BoltEffect | ExplosionEffect)[] = [];
  private speed: number;
  private startPosition!: Vector;
  private endPosition!: Vector;
  private startTime!: number;
  private startWait!: number;

  constructor(props: Props) {
    super(props.getRandom, props.particleEmitterContainer);
    const { args, weaponAnimationService, omitHitExplosion } = props;

    this.animations = [];
    this.speed = args.speed || 1;
    this.duration = 0;
    this.setShots(props);
    this.setStartPosition(props);
    this.setEndPosition(props);
    this.setStartTime(props);

    const missExtra = this.getRandom() * 300 + 300;
    const missFade = missExtra * 0.8;

    this.shots.forEach((shot) => {
      const duration =
        this.startPosition.distanceTo(this.endPosition.add(shot.offset)) /
        this.speed;

      this.animations.push(
        weaponAnimationService.getBoltEffect(
          this.startTime + shot.startExtra,
          this.startPosition.clone(),
          this.endPosition.clone(),
          this.speed,
          shot.hit ? 0 : missFade,
          shot.hit ? duration : duration + missExtra,
          props.args,
          this
        )
      );

      if (shot.hit && !omitHitExplosion) {
        this.animations.push(
          weaponAnimationService.getDamageExplosion(
            props.args.explosionSize,
            this.endPosition.add(shot.offset),
            this.startTime + shot.startExtra + duration,
            this,
            props.args.explosionType
          )
        );
      }
    });
  }

  setShots(props: Props) {
    const { totalShots, shotsHit, args } = props;

    let startExtra = 0;
    this.shots = [];
    const hitsStart = Math.floor(this.getRandom() * (totalShots - shotsHit));

    const offsetVector = this.getRandomPosition(args.size);

    const length = args.length || 10;

    for (let currentShot = 0; currentShot < totalShots; currentShot++) {
      const hit =
        currentShot >= hitsStart && currentShot < hitsStart + shotsHit;

      startExtra = ((5 * length) / this.speed) * currentShot;

      const n = currentShot - hitsStart;

      let offset = new Vector();
      if (n < 0) {
        offset = offset.sub(offsetVector.multiplyScalar(Math.abs(n)));
      } else if (n > 0) {
        offset = offset.add(offsetVector.multiplyScalar(Math.abs(n)));
      }

      this.shots.push({
        startExtra: startExtra,
        hit,
        offset,
      });
    }
  }

  getFirstHit() {
    return this.shots.find((shot) => shot.hit);
  }

  setEndPosition(props: Props) {
    const { targetIcon, impactPosition, getPosition, shotsHit, fireEntry } =
      props;

    if (impactPosition) {
      if (shotsHit === 0) {
        this.endPosition = impactPosition.add(this.getRandomPosition(20));
      } else {
        this.endPosition = impactPosition;
      }
    } else {
      const { position, facing } = getPosition(targetIcon.ship);
      if (shotsHit === 0) {
        this.endPosition = this.getRandomLocationOnShip(targetIcon, facing)
          .add(position)
          .add(this.getRandomPosition(50));
      } else {
        const damage =
          fireEntry.damages.length > 0
            ? fireEntry.damages[
                Math.floor(this.getRandom() * fireEntry.damages.length)
              ]
            : null;

        const damageEntry =
          damage && damage.entries.length > 0
            ? damage.entries[
                Math.floor(this.getRandom() * damage.entries.length)
              ]
            : null;

        if (damageEntry) {
          const system = targetIcon.ship.systems.getSystemById(
            damageEntry.systemId
          );

          this.endPosition = this.getLocationForSystemOrRandomLocationOnSection(
            system,
            targetIcon,
            facing
          ).add(position);
        } else {
          this.endPosition = getPosition(targetIcon.ship).position.add(
            this.getRandomPosition(20)
          );
          this.endPosition.z += targetIcon.shipZ;
        }
      }
    }
  }

  setStartTime(props: Props) {
    const { animationStartTime, impactTime } = props;

    if (impactTime) {
      this.startWait = 0;
      const firstHit = this.getFirstHit();
      const startExtra = firstHit ? firstHit.startExtra : 0;

      const distance = this.startPosition.distanceTo(this.endPosition);
      this.duration = distance / this.speed;
      this.startTime = impactTime - (startExtra + this.duration);
    } else {
      this.startWait = this.getRandom() * 2000;
      this.startTime = animationStartTime + this.startWait;
      const distance = this.startPosition.distanceTo(this.endPosition);
      this.duration = distance / this.speed;
    }
  }

  setStartPosition(props: Props) {
    const { shooterIcon, weapon, getPosition } = props;

    this.startPosition = getPosition(shooterIcon.ship).position.add(
      this.getLocationForSystem(
        weapon,
        shooterIcon,
        getPosition(shooterIcon.ship).facing
      )
    );
  }

  getDuration() {
    return this.duration + this.startWait + 1000;
  }

  deactivate() {
    this.particleEmitterContainer.release(this);
  }
}

export default ShipWeaponUniversalBoltAnimation;
