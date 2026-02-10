import ShipSystemStrategy from "../ShipSystemStrategy";
declare class WeaponAnimationStrategy extends ShipSystemStrategy {
    private animationName;
    private animationArguments;
    constructor(animationName: string, animationArguments?: {});
    getWeaponFireAnimationName(): string;
    getWeaponFireAnimationArguments(): Record<string, unknown>;
}
export default WeaponAnimationStrategy;
