import ShipSystemStrategy from "../ShipSystemStrategy.mjs";

class LaunchTorpedoStrategy extends ShipSystemStrategy {
  constructor(loadingTime, launchers) {
    super();

    this.loadingTime = loadingTime;
    this.turnsLoaded = loadingTime;
    this.launchers = launchers;
  }

  getUiComponents(payload, previousResponse = []) {
    return [
      ...previousResponse,
      this.launchers.map(launcher => ({
        name: "TorpedoLauncher",
        props: {
          launcher
        }
      }))
    ];
  }
}

export default LaunchTorpedoStrategy;
