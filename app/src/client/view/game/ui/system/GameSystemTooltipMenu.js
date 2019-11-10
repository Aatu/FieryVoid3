import * as React from "react";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import OEWButtons from "../electronicWarfare/OEWButtons";

class GameSystemTooltipMenu extends React.PureComponent {
  render() {
    const { ship, system, uiState } = this.props;
    const { currentUser } = uiState.services;

    const myShip = ship.player.is(currentUser);
    const selectedShip = uiState.getSelectedShip();

    return (
      <TooltipMenu>
        {myShip && ship.systems.power.canSetOnline(system) && (
          <TooltipButton
            img="/img/offline.png"
            onClick={() => {
              system.power.setOnline();
              uiState.shipSystemStateChanged(ship, system);
              uiState.shipStateChanged(ship);
              this.forceUpdate();
            }}
          />
        )}

        {myShip && ship.systems.power.canSetOffline(system) && (
          <TooltipButton
            img="/img/goOffline.png"
            onClick={() => {
              system.power.setOffline();
              uiState.shipSystemStateChanged(ship, system);
              uiState.shipStateChanged(ship);
              this.forceUpdate();
            }}
          />
        )}
      </TooltipMenu>
    );
  }
}

export default GameSystemTooltipMenu;
