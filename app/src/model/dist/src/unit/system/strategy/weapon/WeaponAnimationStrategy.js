import ShipSystemStrategy from "../ShipSystemStrategy";
class WeaponAnimationStrategy extends ShipSystemStrategy {
    animationName;
    animationArguments;
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
