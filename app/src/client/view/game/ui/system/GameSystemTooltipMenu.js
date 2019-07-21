import * as React from "react";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import OEWButtons from "../electronicWarfare/OEWButtons";

class GameSystemTooltipMenu extends React.PureComponent {
  render() {
    const { ship, system, uiState } = this.props;
    const { currentUser } = uiState.services;

    const selectedShip = uiState.getSelectedShip();

    return (
      <TooltipMenu>
        <TooltipButton
          img="/img/selectShip.png"
          onClick={() => uiState.selectShip(ship)}
        />
      </TooltipMenu>
    );
  }
}

export default GameSystemTooltipMenu;
