import ShipSystemStrategy from "./ShipSystemStrategy.mjs";

class RadiateHeatStrategy extends ShipSystemStrategy {
  constructor(radiationCapacity) {
    super();
    this.radiationCapacity = radiationCapacity;

    this.heatRadiated = 0;
  }

  isRadiator() {
    return true;
  }

  getMessages(payload, previousResponse = []) {
    previousResponse.push({
      header: "Radiates heat",
      value: `${this.getHeatRadiationCapacity()}`,
    });

    return previousResponse;
  }

  getRadiatedHeat(payload, previousResponse = 0) {
    return this.heatRadiated + previousResponse;
  }

  getHeatRadiationCapacity(payload, previousResponse = 0) {
    if (this.system.isDisabled()) {
      return previousResponse;
    }

    const undamaged = this.system.damage.getPercentUnDamaged();
    let capacity =
      Math.floor(this.radiationCapacity * undamaged) - this.heatRadiated;

    if (capacity < 0) {
      capacity = 0;
    }

    return previousResponse + capacity;
  }

  radiateHeat(heat, previousResponse = 0) {
    let heatLeft = heat - previousResponse;
    if (heatLeft <= 0) {
      return previousResponse;
    }

    const capacity = this.getHeatRadiationCapacity();
    if (capacity < heatLeft) {
      heatLeft = capacity;
    }

    this.heatRadiated += heatLeft;

    return previousResponse + heatLeft;
  }
}

export default RadiateHeatStrategy;
