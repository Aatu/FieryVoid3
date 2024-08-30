import * as THREE from "three";
import Animation from "../Animation";
import { ParticleEmitterContainer } from "../particle";
import Vector from "@fieryvoid3/model/src/utils/Vector";
import ShipObject from "../../renderer/ships/ShipObject";
import {
  degreeToRadian,
  hexFacingToAngle,
} from "@fieryvoid3/model/src/utils/math";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";

class ShipWeaponAnimation extends Animation {
  protected particleEmitterContainer: ParticleEmitterContainer;

  constructor(
    getRandom: () => number,
    particleEmitterContainer: ParticleEmitterContainer
  ) {
    super(getRandom);
    this.particleEmitterContainer = particleEmitterContainer;
  }

  transformLocation(
    location: THREE.Vector3,
    icon: ShipObject,
    facing: number,
    roll: number
  ): Vector {
    const object = new THREE.Object3D();
    object.quaternion.setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      degreeToRadian(-hexFacingToAngle(facing))
    );

    const tmpQuaternion = new THREE.Quaternion();
    tmpQuaternion
      .setFromAxisAngle(
        new THREE.Vector3(1, 0, 0).normalize(),
        degreeToRadian(roll)
      )
      .normalize();

    object.quaternion.multiply(tmpQuaternion);

    const result = location.clone();
    result.applyQuaternion(object.quaternion);
    result.z += icon.shipZ;
    return new Vector(result);
  }

  getLocationForSystemOrRandomLocationOnSection(
    system: ShipSystem,
    icon: ShipObject,
    facing: number,
    roll: number = 0
  ) {
    if (roll !== 0) {
      throw new Error("Roll is not yet implemented");
    }

    let location = this.getLocationForSystem(system, icon, facing, (roll = 0));
    if (!location.equals(new Vector())) {
      return location;
    }

    location = icon.shipObjectBoundingBox.getRandomPositionForSystem(
      system,
      this.getRandom
    );

    return this.transformLocation(location.toThree(), icon, facing, roll);
  }

  getRandomLocationOnShip(
    icon: ShipObject,
    facing: number,
    roll: number = 0
  ): Vector {
    const location = icon.shipObjectBoundingBox.getRandomPositionOnShip(
      this.getRandom
    );

    if (roll !== 0) {
      throw new Error("Roll is not yet implemented");
    }

    if (!location) {
      return new Vector();
    }

    return this.transformLocation(location.toThree(), icon, facing, roll);
  }

  getLocationForSystem(
    system: ShipSystem,
    icon: ShipObject,
    facing: number,
    roll: number = 0
  ) {
    const location = icon.getSystemLocation(system);

    if (roll !== 0) {
      throw new Error("Roll is not yet implemented");
    }

    if (!location) {
      return new Vector();
    }

    return this.transformLocation(location, icon, facing, roll);
  }

  update(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public render(payload: RenderPayload) {}
}

export default ShipWeaponAnimation;
