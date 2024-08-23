import React from "react";
import styled from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import { Play } from "../../../../styled/icon";
import CCEWButtons from "../electronicWarfare/CCEWButtons";
import { TOOLTIP_TAB } from "./ShipTooltip";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import UIState from "../UIState";

const BackTooltipMenu = styled(TooltipMenu)``;

const RotatedButton = styled(TooltipButton)`
  transform: rotate(180deg);
  height: 30px;
`;

const GameShipTooltipMenuTorpedoDefense: React.FC<{
  selectTooltipTab: (tab: TOOLTIP_TAB | null) => void;
  ship: Ship;
  uiState: UIState;
}> = ({ selectTooltipTab, ship, uiState }) => {
  return (
    <BackTooltipMenu>
      <RotatedButton onClick={() => selectTooltipTab(null)}>
        <Play />
      </RotatedButton>
      <CCEWButtons
        ship={ship}
        uiState={uiState}
        ccew={ship.electronicWarfare.getCcEw()}
      />
    </BackTooltipMenu>
  );
};

export default GameShipTooltipMenuTorpedoDefense;
