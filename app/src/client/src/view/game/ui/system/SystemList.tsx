import * as React from "react";
import SystemIcon from "./SystemIcon";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import UIState from "../UIState";

type SystemListProps = {
  ship: Ship;
  uiState: UIState;
  systems: ShipSystem[];
};

const SystemList: React.FC<SystemListProps> = ({
  ship,
  uiState,
  systems,
  ...rest
}) => {
  if (!ship) {
    return null;
  }

  return systems.map((system) => (
    <SystemIcon
      scs
      uiState={uiState}
      key={`system-list-${system.id}`}
      system={system}
      ship={ship}
      {...rest}
    />
  ));
};

export default SystemList;
