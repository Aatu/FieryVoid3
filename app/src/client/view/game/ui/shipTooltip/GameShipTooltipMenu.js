import * as React from "react";
import styled from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";

class GameShipTooltipMenu extends React.PureComponent {
  render() {
    const { ship, uiState } = this.props;
    const { currentUser } = uiState.services;

    const selectShip = uiState.getSelectedShip();

    return (
      <TooltipMenu>
        {ship.player.isUsers(currentUser) && !uiState.isSelected(ship) && (
          <TooltipButton
            img="/img/selectShip.png"
            onClick={() => uiState.selectShip(ship)}
          />
        )}

        {!ship.player.isUsers(currentUser) && selectShip && (
          <>
            <TooltipButton
              img="/img/removeOEW.png"
              disabled={
                !selectShip.electronicWarfare.canAssignOffensiveEw(ship, -1)
              }
              onClick={() => {
                selectShip.electronicWarfare.assignOffensiveEw(ship, -1);
                uiState.shipStateChanged(selectShip);
              }}
            />

            <TooltipButton
              img="/img/addOEW.png"
              disabled={
                !selectShip.electronicWarfare.canAssignOffensiveEw(ship, 1)
              }
              onClick={() => {
                selectShip.electronicWarfare.assignOffensiveEw(ship, 1);
                uiState.shipStateChanged(selectShip);
              }}
            />
          </>
        )}
      </TooltipMenu>
    );
  }
}

export default GameShipTooltipMenu;
