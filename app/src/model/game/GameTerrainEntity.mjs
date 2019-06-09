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
    this.gravity = data.gravity || 10;
    this.position = new Vector(data.position);
    this.velocity = new Vector(data.velocity);
    this.affectedByGravity = this.type !== TERRAIN_TYPE_SUN;

    return this;
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      gravity: this.gravity,
      position: this.position,
      velocity: this.velocity
    };
  }
}

export default GameTerrainEntity;
