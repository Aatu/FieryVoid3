class HitSystemRandomizer {
  rollForSystem(totalStructure) {
    return Math.ceil(Math.random() * totalStructure);
  }

  randomizeHitSystem(systems) {
    const totalStructure = systems.reduce(
      (total, system) => total + system.hitpoints,
      0
    );

    const roll = this.rollForSystem(totalStructure);

    let tested = 0;

    return systems.find(system => {
      if (roll > tested && roll <= system.hitpoints + tested) {
        return true;
      }

      tested += system.hitpoints;
      return false;
    });
  }
}

export default HitSystemRandomizer;
