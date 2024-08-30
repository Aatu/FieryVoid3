import Ship from "../../../../Ship";
import TorpedoFlight from "../../../../TorpedoFlight";
import CargoEntity from "../../../cargo/CargoEntity";
import { SystemMessage } from "../../../strategy/types/SystemHandlersTypes";
import TorpedoDamageStrategy from "./torpedoDamageStrategy/TorpedoDamageStrategy";

type TorpedoVisuals = {
  engineColor: [number, number, number];
  explosionType: string;
  explosionSize: number;
};

class Torpedo extends CargoEntity {
  public minRange: number;
  public maxRange: number;
  public hitSize: number;
  public evasion: number;
  public damageStrategy: TorpedoDamageStrategy | null = null;
  public visuals: TorpedoVisuals;

  constructor({ minRange = 100, maxRange = 300, hitSize = 0, evasion = 30 }) {
    super();
    this.minRange = minRange;
    this.maxRange = maxRange;
    this.hitSize = hitSize;
    this.evasion = evasion;

    this.visuals = {
      engineColor: [51 / 255, 163 / 255, 255 / 255],
      explosionType: "HE",
      explosionSize: 15,
    };
  }

  getDamageStrategy(): TorpedoDamageStrategy {
    if (!this.damageStrategy) {
      throw new Error("No damage strategy set for torpedo");
    }

    return this.damageStrategy;
  }

  getStrikeDistance(flight: TorpedoFlight, target: Ship) {
    return 1;
  }

  getHitSize() {
    return this.hitSize;
  }

  getEvasion() {
    return this.evasion;
  }

  getCargoInfo(): SystemMessage[] {
    const previousResponse = super.getCargoInfo();

    return [
      ...previousResponse,
      { header: "Range", value: `${this.minRange} – ${this.maxRange} hexes` },
      { header: "Evasion", value: `+${this.evasion * 10}% range penalty` },
      ...(this.damageStrategy?.getMessages(undefined, []) || []),
    ];
  }
}

export default Torpedo;
