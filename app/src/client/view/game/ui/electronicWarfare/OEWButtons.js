import * as React from "react";
import styled, { css } from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Text = css`
  color: white;
  font-family: arial;
  font-size: 16px;
  text-transform: uppercase;
`;

const Amount = styled.div`
  ${Text}
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
`;

class OEWButtons extends React.PureComponent {
  render() {
    const { ship, target, uiState, oew } = this.props;
    const { currentUser } = uiState.services;

    return (
      <Container>
        <TooltipButton
          img="/img/removeOEW.png"
          disabled={!ship.electronicWarfare.canAssignOffensiveEw(target, -1)}
          onClick={() => {
            if (ship.electronicWarfare.canAssignOffensiveEw(target, -1)) {
              ship.electronicWarfare.assignOffensiveEw(target, -1);
              uiState.shipStateChanged(ship);
            }
          }}
        />
        <Amount>{oew}</Amount>
        <TooltipButton
          img="/img/addOEW.png"
          disabled={!ship.electronicWarfare.canAssignOffensiveEw(target, 1)}
          onClick={() => {
            if (ship.electronicWarfare.canAssignOffensiveEw(target, 1)) {
              ship.electronicWarfare.assignOffensiveEw(target, 1);
              uiState.shipStateChanged(ship);
            }
          }}
        />
      </Container>
    );
  }
}

export default OEWButtons;
