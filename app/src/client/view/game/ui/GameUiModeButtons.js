import * as React from "react";
import styled from "styled-components";
import * as gameUiModes from "./gameUiModes";
import { TooltipMenu, TooltipButton } from "../../../styled";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 500px;
`;

class GameUiModeButtons extends React.PureComponent {
  render() {
    const { ew, movement, weapons, uiState } = this.props;

    console.log("render GameUiModeButtons");

    return (
      <Container>
        <TooltipButton
          selected={weapons}
          img="/img/targetShip.png"
          onClick={() => uiState.toggleGameUiMode(gameUiModes.WEAPONS)}
        />
        <TooltipButton
          selected={ew}
          img="/img/addOEW.png"
          onClick={() => uiState.toggleGameUiMode(gameUiModes.EW)}
        />
        <TooltipButton
          selected={movement}
          img="/img/selectShip.png"
          onClick={() => uiState.toggleGameUiMode(gameUiModes.MOVEMENT)}
        />
      </Container>
    );
  }
}

export default GameUiModeButtons;
