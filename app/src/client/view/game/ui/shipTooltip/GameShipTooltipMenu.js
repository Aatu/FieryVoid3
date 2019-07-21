import * as React from "react";
import styled from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import OEWButtons from "../electronicWarfare/OEWButtons";

class GameShipTooltipMenu extends React.PureComponent {
  render() {
    const { ship, uiState } = this.props;
    const { currentUser } = uiState.services;

    const selectedShip = uiState.getSelectedShip();

    return (
      <TooltipMenu>
        {ship.player.isUsers(currentUser) && !uiState.isSelected(ship) && (
          <TooltipButton
            img="/img/selectShip.png"
            onClick={() => uiState.selectShip(ship)}
          />
        )}

        {!ship.player.isUsers(currentUser) && selectedShip && (
          <>
            <OEWButtons
              ship={selectedShip}
              target={ship}
              uiState={uiState}
              oew={selectedShip.electronicWarfare.getOffensiveEw(ship)}
            />
          </>
        )}
      </TooltipMenu>
    );
  }
}

export default GameShipTooltipMenu;
