class CargoAmmunitionLoadingStrategy extends StandardLoadingStrategy {
  constructor(loadingTime, ammunitionLoaded) {
    super(loadingTime);

    this.ammunitionLoaded = ammunitionLoaded;
  }

  serialize(payload, previousResponse) {
    return {
      ...super.serialize(payload, previousResponse),
      ammunitionLoaded: this.ammunitionLoaded
        ? this.ammunitionLoaded.serialize()
        : null
    };
  }

  deserialize(data = {}) {
    super.deserialize(data);
    this.ammunitionLoaded = data.ammunitionLoaded
      ? new ammunition[data.ammunitionLoaded]()
      : null;
    return this;
  }

  onWeaponFired() {
    this.turnsLoaded = 0;
    //TODO: use current ammo and find new ammo from magazine
  }

  advanceTurn() {
    if (this.system.isDisabled()) {
      this.turnsLoaded = 0;
      return;
    }

    if (this.ammunitionLoaded === null) {
      this.turnsLoaded = 0;
    }

    this.turnsLoaded++;

    if (this.turnsLoaded > this.loadingTime) {
      this.turnsLoaded = this.loadingTime;
    }
  }
}

export default CargoAmmunitionLoadingStrategy;
