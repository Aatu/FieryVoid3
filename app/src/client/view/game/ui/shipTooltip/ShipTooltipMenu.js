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
          <TooltipButton onClick={() => uiState.selectShip(ship)} />
        )}
        <TooltipButton onClick={() => uiState.openShipWindow(ship)} />
      </TooltipMenu>
    );
  }
}

export default ShipTooltipMenu;
