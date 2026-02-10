import React from "react";
import SystemStrategyUiComponent from "./SystemStrategyUiComponent";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { useUser } from "../../../../../state/userHooks";
import { SYSTEM_HANDLERS } from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";

const SystemStrategyUi: React.FC<{ system: ShipSystem; ship: Ship }> = ({
  system,
  ship,
}) => {
  const { data: currentUser } = useUser();

  const myShip = ship.player.is(currentUser || null);

  return system
    .callHandler(
      SYSTEM_HANDLERS.getUiComponents,
      { myShip },
      [] as { name: string; props: unknown }[]
    )
    .map(({ name, props }, i) => (
      <SystemStrategyUiComponent
        key={`system-stragey-${name}-${system.id}-${i}`}
        ship={ship}
        system={system}
        name={name}
        componentProps={props}
      />
    ));
};

export default SystemStrategyUi;
