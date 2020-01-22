import * as THREE from "three";
import Vector from "../../../../../model/utils/Vector";
import ShipWeaponAnimation from "./ShipWeaponAnimation";
import BoltEffect from "../effect/BoltEffect";
import ExplosionEffect from "../effect/ExplosionEffect";

class ShipWeaponUniversalBoltAnimation extends ShipWeaponAnimation {
  constructor(props) {
    super(props);
    const { args, weaponAnimationService, omitHitExplosion } = props;

    this.animations = [];
    this.speed = args.speed || 1;
    this.duration = 0;
    this.setShots();
    this.setStartPosition();
    this.setEndPosition();
    this.setStartTime();

    const missExtra = this.getRandom() * 300 + 300;
    const missFade = missExtra * 0.8;

    this.shots.forEach(shot => {
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
            this
          )
        );
      }
    });
  }

  setShots() {
    const { totalShots, shotsHit } = this.props;

    let startExtra = 0;
    this.shots = [];
    const hitsStart = Math.floor(this.getRandom() * (totalShots - shotsHit));

    const offsetVector = this.getRandomPosition(5);

    for (let currentShot = 0; currentShot < totalShots; currentShot++) {
      const hit =
        currentShot >= hitsStart && currentShot < hitsStart + shotsHit;

      /*
        hitsStart: 2

        0: miss,
        1: miss,
        2: hit,
        3: hit,
        4: hit,
        5: miss

        hit = currentShot >= hitsStart && currentShot < hitsStart + shotsHit


      */

      startExtra = (30 / this.speed) * currentShot;

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
        offset
      });
    }
  }

  getFirstHit() {
    return this.shots.find(shot => shot.hit);
  }

  setEndPosition() {
    const {
      targetIcon,
      animationStartTime,
      impactPosition,
      getPosition,
      shotsHit
    } = this.props;

    if (impactPosition) {
      if (shotsHit === 0) {
        this.endPosition = impactPosition.add(this.getRandomPosition(20));
      } else {
        this.endPosition = impactPosition;
      }
    } else {
      this.endPosition = getPosition(
        targetIcon,
        animationStartTime
      ).position.add(this.getRandomPosition(20));
      this.endPosition.z += targetIcon.shipZ;
    }
  }

  setStartTime() {
    const { animationStartTime, impactTime } = this.props;

    if (impactTime) {
      this.startWait = 0;
      const firstHit = this.getFirstHit();
      const startExtra = firstHit ? firstHit.startExtra : 0;

      const distance = this.startPosition.distanceTo(this.endPosition);
      this.duration = distance / this.speed;
      this.startTime = impactTime - (startExtra + this.duration);
    } else {
      this.startWait = this.getRandom() * 2000;
      this.startTime = animationStartTime;
      const distance = this.startPosition.distanceTo(this.endPosition);
      this.duration = distance / this.speed;
    }
  }

  setStartPosition() {
    const { shooterIcon, weapon, animationStartTime, getPosition } = this.props;
    this.startPosition = getPosition(
      shooterIcon,
      animationStartTime
    ).position.add(
      this.getLocationForSystem(
        weapon,
        shooterIcon,
        getPosition(shooterIcon, animationStartTime).facing
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
