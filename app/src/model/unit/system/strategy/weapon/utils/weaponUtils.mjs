export const randomizeHitSystem = systems => {
  const totalStructure = systems.reduce(
    (total, system) => total + system.hitpoints
  );

  const roll = Math.floor(Math.random() * totalStructure);
  let structure = 0;
  return systems.find(system => {
    if (roll => structure && roll < system.hitpoints + structure) {
      return true;
    }

    structure += system.hitpoints;
    return false;
  });
};
