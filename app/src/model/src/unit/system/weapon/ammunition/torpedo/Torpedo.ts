import Ship from "../../../../Ship.js";
import TorpedoFlight from "../../../../TorpedoFlight.js";
import CargoEntity from "../../../cargo/CargoEntity.js";
import { SystemMessage } from "../../../strategy/types/SystemHandlersTypes.js";
import StandardDamageStrategy from "../../../strategy/weapon/StandardDamageStrategy.js";

export type TorpedoDamageStrategy = StandardDamageStrategy & {
  getStrikeDistance: (payload: {
    target: Ship;
    torpedoFlight: TorpedoFlight;
  }) => number;
};

class Torpedo extends CargoEntity {
  public minRange: number;
  public maxRange: number;
  public hitSize: number;
  public evasion: number;
  public damageStrategy: TorpedoDamageStrategy | null = null;
  public visuals: Record<string, unknown>;

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
