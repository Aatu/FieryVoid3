import * as React from "react";
import styled, { css } from "styled-components";
import { TooltipButton } from "../../../../styled";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import { useUiStateHandler } from "../../../../state/useUIStateHandler";

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

type CCEWButtonsProps = {
  name?: string;
  ship: Ship;
  ccew: number;
};

const CCEWButtons: React.FC<CCEWButtonsProps> = ({
  name,
  ship,

  ccew,
  ...rest
}) => {
  const uiState = useUiStateHandler();
  return (
    <Container {...rest}>
      {name && <ShipName>{name}</ShipName>}
      <TooltipButton
        $img="/img/removeCCEW.png"
        onClick={() => {
          if (ship.electronicWarfare.canAssignCcEw(-1)) {
            ship.electronicWarfare.assignCcEw(-1);
            uiState.shipStateChanged(ship);
          }
        }}
      />
      <Amount>{ccew}</Amount>
      <TooltipButton
        $img="/img/addCCEW.png"
        onClick={() => {
          if (ship.electronicWarfare.canAssignCcEw(1)) {
            ship.electronicWarfare.assignCcEw(1);
            uiState.shipStateChanged(ship);
          }
        }}
      />
    </Container>
  );
};

export default CCEWButtons;
