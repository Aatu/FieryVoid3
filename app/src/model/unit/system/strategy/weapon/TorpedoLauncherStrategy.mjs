class TorpedoLauncherStrategy {
  constructor(loadedTorpedo, torpedoClass) {
    this.loadedTorpedo = loadedTorpedo;
    this.nextTorpedoClass = null;
    this.torpedoClass = torpedoClass;
    this.turnsLoaded = 99;
    this.system = null;
  }

  serialize() {}

  setSystem(system) {
    this.sysem = system;
  }

  expendTorpedo() {
    this.loadedTorpedo = null;
  }

  loadNewTorpedo() {}

  advanceTurn() {
    if (this.system.isDisabled() || !this.loadedTorpedo) {
      this.turnsLoaded = 0;
      return;
    }

    this.turnsLoaded++;
  }
}

export default TorpedoLauncherStrategy;
