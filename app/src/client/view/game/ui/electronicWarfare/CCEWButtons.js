import * as React from "react";
import styled, { css } from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Text = css`
  color: white;
  font-size: 18px;
  font-weight: bold;
  font-family: arial;
  font-size: 16px;
  text-transform: uppercase;
`;

const ShipName = styled.div`
  ${Text}
  padding: 0 5px 0 30px;
  width: 200px;
  overflow: hidden;
`;

const Amount = styled.div`
  ${Text}
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
`;

class CCEWButtons extends React.PureComponent {
  render() {
    const { name, ship, uiState, ccew } = this.props;

    return (
      <Container>
        {name && <ShipName>{name}</ShipName>}
        <TooltipButton
          img="/img/removeCCEW.png"
          onClick={() => {
            if (ship.electronicWarfare.canAssignCcEw(-1)) {
              ship.electronicWarfare.assignCcEw(-1);
              uiState.shipStateChanged(ship);
            }
          }}
        />
        <Amount>{ccew}</Amount>
        <TooltipButton
          img="/img/addCCEW.png"
          onClick={() => {
            if (ship.electronicWarfare.canAssignCcEw(1)) {
              ship.electronicWarfare.assignCcEw(1);
              uiState.shipStateChanged(ship);
            }
          }}
        />
      </Container>
    );
  }
}

export default CCEWButtons;
