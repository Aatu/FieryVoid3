import * as React from "react";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import UIState from "../UIState";
import { useUser } from "../../../../state/userHooks";
import { useForceRerender } from "../../../../util/useForceRerender";

type Props = {
  ship: Ship;
  system: ShipSystem;
  uiState: UIState;
};

const GameSystemTooltipMenu: React.FC<Props> = ({ ship, system, uiState }) => {
  const { data: currentUser } = useUser();
  const rerender = useForceRerender();

  const myShip = ship.player.is(currentUser || null);

  if (system.isDestroyed()) {
    return null;
  }

  return (
    <TooltipMenu>
      {system.handlers
        .getTooltipMenuButton({ myShip })
        .sort((a, b) => {
          if (a.sort > b.sort) {
            return 1;
          }

          if (a.sort < b.sort) {
            return -1;
          }

          return 0;
        })
        .map(({ img, disabledHandler, clickHandler }, i) => (
          <TooltipButton
            key={`custom-system-tooltip-button-${i}`}
            $img={img}
            disabled={disabledHandler ? disabledHandler() : false}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clickHandler();
              uiState.shipSystemStateChanged(ship, system);
              uiState.shipStateChanged(ship);
              rerender();
            }}
          />
        ))}
    </TooltipMenu>
  );
};

export default GameSystemTooltipMenu;
