import * as React from "react";
import { TooltipMenu, TooltipButton } from "../../../../styled";

class GameSystemTooltipMenu extends React.Component {
  render() {
    const { ship, system, uiState } = this.props;
    const { currentUser } = uiState.services;

    const myShip = ship.player.is(currentUser);
    const selectedShip = uiState.getSelectedShip();

    if (system.isDestroyed()) {
      return null;
    }

    return (
      <TooltipMenu>
        {system
          .callHandler(
            "getTooltipMenuButton",
            { uiState, myShip, selectedShip },
            []
          )
          .sort((a, b) => {
            if (a.sort > b.sort) {
              return 1;
            }

            if (a.sort < b.sort) {
              return -1;
            }

            return 0;
          })
          .map(({ img, disabledHandler, onClickHandler }, i) => (
            <TooltipButton
              key={`custom-system-tooltip-button-${i}`}
              img={img}
              disabled={disabledHandler ? disabledHandler() : false}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClickHandler();
                uiState.shipSystemStateChanged(ship, system);
                uiState.shipStateChanged(ship);
                this.forceUpdate();
              }}
            />
          ))}
      </TooltipMenu>
    );
  }
}

export default GameSystemTooltipMenu;
