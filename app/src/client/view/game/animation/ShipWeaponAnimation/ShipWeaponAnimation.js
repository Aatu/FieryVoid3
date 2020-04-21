import * as THREE from "three";
import Animation from "../Animation";
import Vector from "../../../../../model/utils/Vector";
import { degreeToRadian } from "../../../../../model/utils/math.mjs";
import { hexFacingToAngle } from "../../../../../model/utils/math.mjs";

class ShipWeaponAnimation extends Animation {
  constructor(props) {
    super(props.getRandom);
    this.particleEmitterContainer = props.particleEmitterContainer;
    this.props = props;
  }

  transformLocation(location, icon, facing, roll) {
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
    return result;
  }

  getLocationForSystemOrRandomLocationOnSection(
    system,
    icon,
    facing,
    roll = 0
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

  getRandomLocationOnShip(icon, facing, roll = 0) {
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

  getLocationForSystem(system, icon, facing, roll = 0) {
    const location = icon.systemLocations[system.id];

    if (roll !== 0) {
      throw new Error("Roll is not yet implemented");
    }

    if (!location) {
      return new Vector();
    }

    return this.transformLocation(location, icon, facing, roll);
  }
}

export default ShipWeaponAnimation;
