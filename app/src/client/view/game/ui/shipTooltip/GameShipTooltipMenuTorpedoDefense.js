import * as React from "react";
import styled from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import { Play } from "../../../../styled/icon";
import CCEWButtons from "../electronicWarfare/CCEWButtons";

const BackTooltipMenu = styled(TooltipMenu)``;

const RotatedButton = styled(TooltipButton)`
  transform: rotate(180deg);
  height: 30px;
`;

class GameShipTooltipMenuTorpedoDefense extends React.PureComponent {
  render() {
    const { selectTooltipTab, ship, uiState } = this.props;

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
  }
}

export default GameShipTooltipMenuTorpedoDefense;
