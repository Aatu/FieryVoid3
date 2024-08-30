import * as React from "react";
import SystemIcon from "./SystemIcon";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import Ship from "@fieryvoid3/model/src/unit/Ship";

type SystemListProps = {
  ship: Ship;
  systems: ShipSystem[];
};

const SystemList: React.FC<SystemListProps> = ({ ship, systems }) => {
  if (!ship) {
    return null;
  }

  return systems.map((system) => (
    <SystemIcon
      scs
      key={`system-list-${system.id}`}
      systemId={system.id}
      ship={ship}
    />
  ));
};

export default SystemList;
