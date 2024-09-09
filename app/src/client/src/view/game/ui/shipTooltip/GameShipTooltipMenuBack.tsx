import * as React from "react";
import styled from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import { Play } from "../../../../styled/icon";
import { ShipTooltipMenuProviderProps } from "../UIState";

const BackTooltipMenu = styled(TooltipMenu)``;

const RotatedButton = styled(TooltipButton)`
  transform: rotate(180deg);
  height: 30px;
`;

const GameShipTooltipMenuBack: React.FC<ShipTooltipMenuProviderProps> = ({
  selectTooltipTab,
}) => {
  return (
    <BackTooltipMenu>
      <RotatedButton onClick={() => selectTooltipTab(null)}>
        <Play />
      </RotatedButton>
    </BackTooltipMenu>
  );
};

export default GameShipTooltipMenuBack;
