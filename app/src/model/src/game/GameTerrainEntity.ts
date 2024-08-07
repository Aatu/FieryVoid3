import Vector from "../utils/Vector";

const TERRAIN_TYPE_SUN = "sun";

export type SerializedGameTerrainEntity = {
  id?: string | null;
  type?: string;
  mass?: number;
  position?: Vector;
  velocity?: Vector;
  diameter?: number;
  radius?: number;
  gravity?: number;
};

class GameTerrainEntity {
  public id!: string | null;
  public type!: string;
  public mass!: number;
  public position!: Vector;
  public velocity!: Vector;
  public diameter!: number;
  public radius!: number;
  public affectedByGravity!: boolean;
  public gravity!: number;

  constructor(data: SerializedGameTerrainEntity) {
    this.deserialize(data);
  }

  getGravityVector(position: Vector) {
    const distance = position.distanceTo(this.position);
    const actualGravity = this.gravity / Math.pow(distance, 2);

    const gravityVector = this.position
      .sub(position)
      .normalize()
      .multiplyScalar(actualGravity);

    return gravityVector;
  }

  deserialize(data: SerializedGameTerrainEntity = {}) {
    this.id = data.id || null;
    this.type = data.type || TERRAIN_TYPE_SUN;
    this.mass = 10000000000; // data.mass || 1000000000;
    this.position = new Vector(data.position);
    this.velocity = new Vector(data.velocity);
    this.diameter = 7; // data.diameter || 1;
    this.radius = data.radius || 1;
    this.affectedByGravity = this.type !== TERRAIN_TYPE_SUN;
    this.gravity = 0.0000000000667 * this.mass;

    return this;
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      velocity: this.velocity,
      radius: this.diameter,
      mass: this.mass,
    };
  }
}

export default GameTerrainEntity;
