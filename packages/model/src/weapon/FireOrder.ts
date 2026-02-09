import Ship from "../unit/Ship";
import ShipSystem from "../unit/system/ShipSystem";

export type SerializedFireOrder = {
  id?: string | null;
  shooterId: string;
  targetId: string;
  weaponId: number;
  weaponSettings: Record<string, unknown>;
  resolved: boolean;
};

class FireOrder {
  public id: string | null;
  public shooterId: string;
  public targetId: string;
  public weaponId: number;
  public weaponSettings: Record<string, unknown>;
  public resolved: boolean;

  public static fromData(data: SerializedFireOrder): FireOrder {
    return new FireOrder(
      data.id || null,
      data.shooterId,
      data.targetId,
      data.weaponId,
      data.weaponSettings || {},
      data.resolved
    );
  }

  constructor(
    id: string | null,
    shooter: string | Ship,
    target: string | Ship,
    weapon: number | ShipSystem,
    weaponSettigs: Record<string, unknown> = {},
    resolved: boolean = false
  ) {
    this.id = id;
    this.shooterId = shooter instanceof Ship ? shooter.getId() : shooter;
    this.targetId = target instanceof Ship ? target.getId() : target;
    this.weaponId = weapon instanceof ShipSystem ? weapon.id : weapon;
    this.weaponSettings = weaponSettigs;
    this.resolved = resolved;
  }

  setId(id: string | null): FireOrder {
    this.id = id;
    return this;
  }
  getId(): string {
    if (!this.id) {
      throw new Error("FireOrder has no id");
    }
    return this.id;
  }

  setResolved() {
    this.resolved = true;
    return this;
  }

  serialize(): SerializedFireOrder {
    return {
      id: this.id,
      shooterId: this.shooterId,
      targetId: this.targetId,
      weaponId: this.weaponId,
      weaponSettings: this.weaponSettings,
      resolved: this.resolved,
    };
  }

  deserialize(data: SerializedFireOrder): FireOrder {
    return FireOrder.fromData(data);
  }
}

export default FireOrder;
