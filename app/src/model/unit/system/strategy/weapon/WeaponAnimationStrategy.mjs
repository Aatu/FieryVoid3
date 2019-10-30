import ShipSystemStrategy from "../ShipSystemStrategy.mjs";

class WeaponAnimationStrategy extends ShipSystemStrategy {
  constructor(animationName, animationArguments = {}) {
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
