import ShipSystemStrategy from "../ShipSystemStrategy";

class WeaponAnimationStrategy extends ShipSystemStrategy {
  private animationName: string;
  private animationArguments: Record<string, unknown>;

  constructor(animationName: string, animationArguments = {}) {
    super();
    this.animationName = animationName;
    this.animationArguments = animationArguments;
  }

  getWeaponFireAnimationName() {
    return this.animationName;
  }

  getWeaponFireAnimationArguments() {
    return this.animationArguments;
  }
}

export default WeaponAnimationStrategy;
