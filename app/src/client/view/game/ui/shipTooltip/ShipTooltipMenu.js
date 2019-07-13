import * as React from "react";
import styled from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";

class ShipTooltipMenu extends React.PureComponent {
  render() {
    const { ship, uiState } = this.props;
    const { currentUser } = uiState.services;

    return (
      <TooltipMenu>
        {ship.player.isUsers(currentUser) && !uiState.isSelected(ship) && (
          <TooltipButton
            img="/img/selectShip.png"
            onClick={() => uiState.selectShip(ship)}
          />
        )}

        {!ship.player.isUsers(currentUser) && uiState.getSelectedShip() && (
          <>
            <TooltipButton
              img="/img/addOEW.png"
              onClick={() => uiState.selectShip(ship)}
            />
            <TooltipButton
              img="/img/removeOEW.png"
              onClick={() => uiState.selectShip(ship)}
            />
          </>
        )}
      </TooltipMenu>
    );
  }
}

export default ShipTooltipMenu;
