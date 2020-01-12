const getInterestingStuffInPosition = (payload, shipIconContainer) => {
  const mouseovered = payload.entities.filter(
    entity => entity instanceof window.ShipObject && !entity.ship.isDestroyed()
  );

  if (mouseovered.length > 0) {
    return mouseovered;
  }

  return shipIconContainer
    .getIconsInProximity(payload)
    .filter(icon => !icon.ship.isDestroyed());
};

class PhaseStrategy {
  constructor(services) {
    this.services = services;
    this.strategies = [];
    this.inactive = true;

    this.gameData = null;

    this.animationPaused = true;
    this.animationReversed = false;
    this.currentDeltaTime = 0;
    this.animationStartTime = 0;
    this.totalAnimationTime = 0;
    this.lastAnimationTime = 0;
    this.animationEndtime = 0;
    this.animationTurnLength = null;
  }

  onEvent(name, payload) {
    this.callStrategies(name, payload);
  }

  updateStrategies(gamedata) {
    this.strategies.forEach(strategy => strategy.update(gamedata));
  }

  activateStrategies() {
    this.strategies.forEach(strategy => strategy.activate(this.services));
  }

  callStrategies(functionName, payload) {
    this.strategies.forEach(strategy => {
      if (strategy[functionName] && (!payload || !payload.stopped)) {
        strategy[functionName](payload);
      }
    });
  }

  render(coordinateConverter, scene, zoom) {
    this.updateDeltaTime(this.animationPaused);
    this.updateTotalAnimationTime(this.animationPaused);

    const { shipIconContainer, torpedoIconContainer } = this.services;

    const renderPayload = {
      delta: this.currentDeltaTime,
      total: this.totalAnimationTime,
      last: this.lastAnimationTime,
      zoom
    };
    this.callStrategies("render", renderPayload);
    shipIconContainer && shipIconContainer.render(renderPayload);
    torpedoIconContainer && torpedoIconContainer.render(renderPayload);
    return renderPayload;
  }

  animateFromTo(start, end) {
    this.animationStartTime = start;
    this.totalAnimationTime = start;
    this.animationReversed = false;
    this.lastAnimationTime = null;
    this.currentDeltaTime = 0;
    this.animationEndtime = end;
    this.animationPaused = false;
  }

  pauseAnimation() {
    this.animationPaused = true;
  }

  unpauseAnimation() {
    this.animationReversed = false;
    this.animationPaused = false;
  }

  unpauseAndRewindAnimation() {
    this.animationReversed = true;
    this.animationPaused = false;
  }

  setAnimationTime(time) {
    this.totalAnimationTime = time;
    this.lastAnimationTime = null;
    this.currentDeltaTime = 0;
  }

  updateTotalAnimationTime() {
    if (this.animationPaused) {
      return;
    }

    if (this.animationReversed) {
      this.totalAnimationTime -= this.currentDeltaTime;
      if (this.totalAnimationTime < this.animationStartTime) {
        this.totalAnimationTime = this.animationStartTime;
        this.animationPaused = true;
      }
    } else {
      this.totalAnimationTime += this.currentDeltaTime;
      if (
        this.animationEndtime &&
        this.totalAnimationTime >= this.animationEndtime
      ) {
        this.totalAnimationTime = this.animationEndtime;
        this.animationPaused = true;
      }
    }
  }

  updateDeltaTime() {
    const now = Date.now();

    if (!this.lastAnimationTime) {
      this.lastAnimationTime = now;
      this.currentDeltaTime = 0;
    }

    this.currentDeltaTime = now - this.lastAnimationTime;

    this.lastAnimationTime = now;
  }

  update(gamedata) {
    const { uiState } = this.services;

    this.gameData = gamedata;
    uiState.setGameData(gamedata);
    this.updateStrategies(gamedata);

    return this;
  }

  activate() {
    this.inactive = false;
    this.activateStrategies();
    return this;
  }

  deactivate() {
    this.inactive = true;
    this.callStrategies("deactivate");

    return this;
  }

  triggerEvent(name, payload) {
    this.callStrategies(name, payload);
  }

  onScrollEvent(payload) {
    this.callStrategies("onScroll", payload);
  }

  onZoomEvent(payload) {
    this.callStrategies("onZoom", payload);
  }

  canDisturb() {
    return true;
  }

  commitTurn(gameConnector) {}
}

export default PhaseStrategy;
