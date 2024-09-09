import React from "react";
import styled from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import { Play } from "../../../../styled/icon";
import CCEWButtons from "../electronicWarfare/CCEWButtons";
import { ShipTooltipMenuProviderProps } from "../UIState";
import { useShip } from "../../../../state/useShip";

const BackTooltipMenu = styled(TooltipMenu)``;

const RotatedButton = styled(TooltipButton)`
  transform: rotate(180deg);
  height: 30px;
`;

const GameShipTooltipMenuTorpedoDefense: React.FC<
  ShipTooltipMenuProviderProps
> = ({ selectTooltipTab, shipId }) => {
  const ship = useShip(shipId);

  if (!ship) {
    return null;
  }

  return (
    <BackTooltipMenu>
      <RotatedButton onClick={() => selectTooltipTab(null)}>
        <Play />
      </RotatedButton>
      <CCEWButtons ship={ship} ccew={ship.electronicWarfare.getCcEw()} />
    </BackTooltipMenu>
  );
};

export default GameShipTooltipMenuTorpedoDefense;
