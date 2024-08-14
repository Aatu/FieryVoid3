import ShipSystemStrategy from "./ShipSystemStrategy";
import { SystemMessage } from "./types/SystemHandlersTypes";

class RadiateHeatStrategy extends ShipSystemStrategy {
  private radiationCapacity: number;
  private heatRadiated: number;

  constructor(radiationCapacity: number) {
    super();
    this.radiationCapacity = radiationCapacity;

    this.heatRadiated = 0;
  }

  isRadiator() {
    return true;
  }

  getMessages(payload: unknown, previousResponse: SystemMessage[] = []) {
    previousResponse.push({
      header: "Radiates heat",
      value: `${this.getHeatRadiationCapacity(undefined, 0)}`,
    });

    return previousResponse;
  }

  getRadiatedHeat(payload: unknown, previousResponse = 0) {
    return this.heatRadiated + previousResponse;
  }

  getHeatRadiationCapacity(payload: unknown, previousResponse = 0) {
    if (this.getSystem().isDisabled()) {
      return previousResponse;
    }

    const undamaged = this.getSystem().damage.getPercentUnDamaged();
    let capacity =
      Math.floor(this.radiationCapacity * undamaged) - this.heatRadiated;

    if (capacity < 0) {
      capacity = 0;
    }

    return previousResponse + capacity;
  }

  radiateHeat(heat: number, previousResponse = 0) {
    let heatLeft = heat - previousResponse;
    if (heatLeft <= 0) {
      return previousResponse;
    }

    const capacity = this.getHeatRadiationCapacity(undefined, 0);
    if (capacity < heatLeft) {
      heatLeft = capacity;
    }

    this.heatRadiated += heatLeft;

    return previousResponse + heatLeft;
  }
}

export default RadiateHeatStrategy;
