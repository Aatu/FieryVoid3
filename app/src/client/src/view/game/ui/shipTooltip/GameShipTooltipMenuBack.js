import * as React from "react";
import styled from "styled-components";
import { TooltipMenu, TooltipButton } from "../../../../styled";
import { Play } from "../../../../styled/icon";

const BackTooltipMenu = styled(TooltipMenu)``;

const RotatedButton = styled(TooltipButton)`
  transform: rotate(180deg);
  height: 30px;
`;

class GameShipTooltipMenuBack extends React.PureComponent {
  render() {
    const { selectTooltipTab } = this.props;

    return (
      <BackTooltipMenu>
        <RotatedButton onClick={() => selectTooltipTab(null)}>
          <Play />
        </RotatedButton>
      </BackTooltipMenu>
    );
  }
}

export default GameShipTooltipMenuBack;
