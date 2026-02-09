import ShipSystemStrategy from "../ShipSystemStrategy";
import WeaponHitChance from "../../../../weapon/WeaponHitChance";
import Ship from "../../../Ship";
import TorpedoFlight from "../../../TorpedoFlight";
import { TorpedoFlightForIntercept } from "../../../TorpedoFlightForIntercept";
declare class InterceptorStrategy extends ShipSystemStrategy {
    private usedIntercepts;
    getUsedIntercepts(): number;
    addUsedIntercept(amount?: number): void;
    canIntercept(): boolean;
    onWeaponFired(): void;
    getInterceptChance({ target, torpedoFlight, }: {
        target: Ship;
        torpedoFlight: TorpedoFlight | TorpedoFlightForIntercept;
    }): WeaponHitChance;
    advanceTurn(): void;
}
export default InterceptorStrategy;
