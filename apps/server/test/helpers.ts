import ShipSystem from "../../model/src/unit/system/ShipSystem";

export const systemsToNameIdString = (
  systems: ShipSystem[] | ShipSystem
): string[] => {
  return ([] as ShipSystem[])
    .concat(systems)
    .map((system) => `${system.getDisplayName()} id: '${system.id}'`);
};
