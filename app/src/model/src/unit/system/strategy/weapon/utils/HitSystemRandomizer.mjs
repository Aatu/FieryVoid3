class HitSystemRandomizer {
  rollForSystem(totalStructure) {
    return Math.ceil(Math.random() * totalStructure);
  }

  randomizeHitSystem(systems) {
    if (systems.length === 0) {
      return null;
    }

    const totalStructure = systems.reduce(
      (total, system) => total + this.getSystemHitSize(system),
      0
    );

    const roll = this.rollForSystem(totalStructure);

    let tested = 0;

    return systems.find(system => {
      if (roll > tested && roll <= this.getSystemHitSize(system) + tested) {
        return true;
      }

      tested += this.getSystemHitSize(system);
      return false;
    });
  }

  getSystemHitSize(system) {
    return (
      system.hitpoints *
      system.callHandler("getHitSystemSizeMultiplier", null, 1)
    );
  }
}

export default HitSystemRandomizer;
