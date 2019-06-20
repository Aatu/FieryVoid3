import Vector from "../../model/utils/Vector";
const TERRAIN_TYPE_SUN = "sun";

class GameTerrainEntity {
  constructor(data) {
    this.deserialize(data);
  }

  getGravityVector(position) {
    const distance = position.distanceTo(this.position);
    const actualGravity = this.gravity / Math.pow(distance, 2);

    const gravityVector = this.position
      .sub(position)
      .normalize()
      .multiplyScalar(actualGravity);

    return gravityVector;
  }

  deserialize(data = {}) {
    this.id = data.id || null;
    this.type = data.type || TERRAIN_TYPE_SUN;
    this.mass = 10000000000; // data.mass || 1000000000;
    this.position = new Vector(data.position);
    this.velocity = new Vector(data.velocity);
    this.diameter = 7; // data.diameter || 1;
    this.radius = this.affectedByGravity = this.type !== TERRAIN_TYPE_SUN;

    return this;
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      velocity: this.velocity,
      radius: this.diameter,
      mass: this.mass
    };
  }
}

export default GameTerrainEntity;
