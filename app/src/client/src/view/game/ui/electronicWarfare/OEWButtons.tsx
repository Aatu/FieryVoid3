import * as React from "react";
import styled, { css } from "styled-components";
import { TooltipButton } from "../../../../styled";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import UIState from "../UIState";

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

type OEWButtonsProps = {
  name?: string;
  ship: Ship;
  target: Ship;
  uiState: UIState;
  oew: number;
};

const OEWButtons: React.FC<OEWButtonsProps> = ({
  name,
  ship,
  target,
  uiState,
  oew,
}) => {
  return (
    <Container>
      {name && <ShipName>{name}</ShipName>}
      <TooltipButton
        $img="/img/removeOEW.png"
        onClick={() => {
          if (ship.electronicWarfare.canAssignOffensiveEw(target, -1)) {
            ship.electronicWarfare.assignOffensiveEw(target, -1);
            uiState.shipStateChanged(ship);
          }
        }}
      />
      <Amount>{oew}</Amount>
      <TooltipButton
        $img="/img/addOEW.png"
        onClick={() => {
          if (ship.electronicWarfare.canAssignOffensiveEw(target, 1)) {
            ship.electronicWarfare.assignOffensiveEw(target, 1);
            uiState.shipStateChanged(ship);
          }
        }}
      />
    </Container>
  );
};

export default OEWButtons;
